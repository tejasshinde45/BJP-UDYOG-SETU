import React, { useState, useEffect } from 'react';
import type {
  GrievanceRecord,
  MeetingRequestRecord,
  AssociationRecord,
  EventItem,
  EventRegistrationRecord,
  FollowUpRecord,
  TimelineEvent,
} from '../types';
import {
  SEED_GRIEVANCES,
  SEED_MEETING_REQUESTS,
  SEED_ASSOCIATIONS,
  SEED_EVENTS,
} from '../data/seedData';
import { DemoDataContext } from './demoDataContextDef';

const STORAGE_KEYS = {
  GRIEVANCES: 'udyog_setu_grievances_v4',
  MEETINGS: 'udyog_setu_meetings_v4',
  ASSOCIATIONS: 'udyog_setu_associations_v4',
  EVENTS: 'udyog_setu_events_v4',
  REGISTRATIONS: 'udyog_setu_registrations_v4',
};

// Helper to generate unique ID with prefix
const generateRefId = (prefix: string, existingList: { referenceId: string }[]): string => {
  let ref = '';
  let exists = true;
  while (exists) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    ref = `${prefix}-${randomDigits}`;
    exists = existingList.some((item) => item.referenceId === ref);
  }
  return ref;
};

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRIEVANCES);
      return saved ? JSON.parse(saved) : SEED_GRIEVANCES;
    } catch {
      return SEED_GRIEVANCES;
    }
  });

  const [meetingRequests, setMeetingRequests] = useState<MeetingRequestRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEETINGS);
      return saved ? JSON.parse(saved) : SEED_MEETING_REQUESTS;
    } catch {
      return SEED_MEETING_REQUESTS;
    }
  });

  const [associations, setAssociations] = useState<AssociationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSOCIATIONS);
      return saved ? JSON.parse(saved) : SEED_ASSOCIATIONS;
    } catch {
      return SEED_ASSOCIATIONS;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : SEED_EVENTS;
    } catch {
      return SEED_EVENTS;
    }
  });

  const [eventRegistrations, setEventRegistrations] = useState<EventRegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(grievances));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [grievances]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetingRequests));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [meetingRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSOCIATIONS, JSON.stringify(associations));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [associations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(eventRegistrations));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [eventRegistrations]);

  // Actions
  const addGrievance = (
    data: Omit<
      GrievanceRecord,
      'id' | 'referenceId' | 'submittedAt' | 'timeline' | 'followUps' | 'status' | 'isDemo'
    >
  ): GrievanceRecord => {
    const refId = generateRefId('MH-US-2025', grievances);
    const now = new Date().toISOString();
    const newRecord: GrievanceRecord = {
      ...data,
      id: `grv-${Date.now()}`,
      referenceId: refId,
      submittedAt: now,
      status: 'Submitted',
      followUps: [],
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          title: 'तक्रार दाखल झाली (Submitted)',
          description: `संदर्भ क्रमांक ${refId} सह उद्योग सेतूवर तक्रार यशस्वीरीत्या नोंदवली गेली.`,
          timestamp: now,
          status: 'Submitted',
          actor: 'सिस्टम नोंद',
        },
      ],
      isDemo: false,
    };

    setGrievances((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateGrievance = (id: string, updates: Partial<GrievanceRecord>) => {
    setGrievances((prev) =>
      prev.map((item) => {
        if (item.id === id || item.referenceId === id) {
          const updated = { ...item, ...updates };
          // If status changed, record in timeline
          if (updates.status && updates.status !== item.status) {
            const tlEvent: TimelineEvent = {
              id: `tl-${Date.now()}`,
              title: `स्थिती बदल: ${updates.status}`,
              description: updates.internalNotes?.length
                ? updates.internalNotes[updates.internalNotes.length - 1]
                : `तक्रारीची स्थिती '${updates.status}' अशी अद्यतनित करण्यात आली.`,
              timestamp: new Date().toISOString(),
              status: updates.status,
              actor: updates.assignedCoordinator || 'प्रशासक डेस्क',
            };
            updated.timeline = [...updated.timeline, tlEvent];
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addFollowUp = (
    referenceId: string,
    comment: string,
    author: string = 'उद्योजक / तक्रारदार'
  ): { success: boolean; error?: string; followUpNumber?: number } => {
    const existing = grievances.find(
      (g) => g.referenceId.toUpperCase() === referenceId.trim().toUpperCase()
    );

    if (!existing) {
      return { success: false, error: 'तक्रार संदर्भ सापडला नाही (Reference not found)' };
    }

    const currentCount = existing.followUps.length;
    if (currentCount >= 2) {
      return {
        success: false,
        error: 'या अर्जासाठी कमाल २ पाठपुरावा नोंदींची मर्यादा पूर्ण झाली आहे (Maximum 2 follow-ups permitted).',
      };
    }

    const followUpNum = (currentCount + 1) as 1 | 2;
    const now = new Date().toISOString();

    const newFollowUp: FollowUpRecord = {
      id: `fu-${Date.now()}`,
      followUpNumber: followUpNum,
      submittedAt: now,
      author,
      comment: comment.trim(),
      statusBefore: existing.status,
    };

    const newTimelineEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      title: followUpNum === 1 ? 'प्रथम पाठपुरावा (1st Follow-up)' : 'द्वितीय पाठपुरावा (2nd Follow-up)',
      description: `तक्रारदाराकडून पाठपुरावा नोंदवला: "${comment.trim()}"`,
      timestamp: now,
      status: existing.status,
      actor: author,
    };

    setGrievances((prev) =>
      prev.map((g) => {
        if (g.referenceId === existing.referenceId) {
          return {
            ...g,
            followUps: [...g.followUps, newFollowUp],
            timeline: [...g.timeline, newTimelineEvent],
          };
        }
        return g;
      })
    );

    return { success: true, followUpNumber: followUpNum };
  };

  const addMeetingRequest = (
    data: Omit<MeetingRequestRecord, 'id' | 'referenceId' | 'submittedAt' | 'status' | 'isDemo'>
  ): MeetingRequestRecord => {
    const refId = generateRefId('MH-LMR-2025', meetingRequests);
    const now = new Date().toISOString();
    const newRecord: MeetingRequestRecord = {
      ...data,
      id: `lmr-${Date.now()}`,
      referenceId: refId,
      submittedAt: now,
      status: 'Pending Review',
      isDemo: false,
    };

    setMeetingRequests((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateMeetingRequest = (id: string, updates: Partial<MeetingRequestRecord>) => {
    setMeetingRequests((prev) =>
      prev.map((m) => (m.id === id || m.referenceId === id ? { ...m, ...updates } : m))
    );
  };

  const addAssociation = (
    data: Omit<AssociationRecord, 'id' | 'referenceId' | 'submittedAt' | 'status' | 'isDemo'>
  ): AssociationRecord => {
    const refId = generateRefId('MH-ASC-2025', associations);
    const now = new Date().toISOString();
    const newRecord: AssociationRecord = {
      ...data,
      id: `asc-${Date.now()}`,
      referenceId: refId,
      submittedAt: now,
      status: 'Pending Verification',
      isDemo: false,
    };

    setAssociations((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateAssociation = (id: string, updates: Partial<AssociationRecord>) => {
    setAssociations((prev) =>
      prev.map((a) => (a.id === id || a.referenceId === id ? { ...a, ...updates } : a))
    );
  };

  const addEventRegistration = (
    data: Omit<EventRegistrationRecord, 'id' | 'referenceId' | 'submittedAt' | 'isDemo'>
  ): EventRegistrationRecord => {
    const refId = generateRefId('MH-REG-2025', eventRegistrations);
    const now = new Date().toISOString();
    const newRecord: EventRegistrationRecord = {
      ...data,
      id: `reg-${Date.now()}`,
      referenceId: refId,
      submittedAt: now,
      isDemo: false,
    };

    setEventRegistrations((prev) => [newRecord, ...prev]);

    // Also increment registeredCount on the event if eventId matched
    if (data.eventId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === data.eventId
            ? { ...ev, registeredCount: (ev.registeredCount || 0) + 1 }
            : ev
        )
      );
    }

    return newRecord;
  };

  const resetDemoData = () => {
    setGrievances(SEED_GRIEVANCES);
    setMeetingRequests(SEED_MEETING_REQUESTS);
    setAssociations(SEED_ASSOCIATIONS);
    setEvents(SEED_EVENTS);
    setEventRegistrations([]);
    localStorage.removeItem(STORAGE_KEYS.GRIEVANCES);
    localStorage.removeItem(STORAGE_KEYS.MEETINGS);
    localStorage.removeItem(STORAGE_KEYS.ASSOCIATIONS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
  };

  const getGrievanceByRef = (ref: string) => {
    if (!ref) return undefined;
    const cleanRef = ref.trim().toUpperCase();
    return grievances.find((g) => g.referenceId.toUpperCase() === cleanRef);
  };

  const value = {
    grievances,
    meetingRequests,
    associations,
    events,
    eventRegistrations,
    addGrievance,
    updateGrievance,
    addFollowUp,
    addMeetingRequest,
    updateMeetingRequest,
    addAssociation,
    updateAssociation,
    addEventRegistration,
    resetDemoData,
    getGrievanceByRef,
  };

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
};
