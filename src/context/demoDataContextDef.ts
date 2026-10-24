import { createContext } from 'react';
import type {
  GrievanceRecord,
  MeetingRequestRecord,
  AssociationRecord,
  EventItem,
  EventRegistrationRecord,
} from '../types';

export interface DemoDataContextType {
  grievances: GrievanceRecord[];
  meetingRequests: MeetingRequestRecord[];
  associations: AssociationRecord[];
  events: EventItem[];
  eventRegistrations: EventRegistrationRecord[];
  // Actions
  addGrievance: (
    data: Omit<
      GrievanceRecord,
      'id' | 'referenceId' | 'submittedAt' | 'timeline' | 'followUps' | 'status' | 'isDemo'
    >
  ) => GrievanceRecord;
  updateGrievance: (id: string, updates: Partial<GrievanceRecord>) => void;
  addFollowUp: (
    referenceId: string,
    comment: string,
    author?: string
  ) => { success: boolean; error?: string; followUpNumber?: number };
  addMeetingRequest: (
    data: Omit<MeetingRequestRecord, 'id' | 'referenceId' | 'submittedAt' | 'status' | 'isDemo'>
  ) => MeetingRequestRecord;
  updateMeetingRequest: (id: string, updates: Partial<MeetingRequestRecord>) => void;
  addAssociation: (
    data: Omit<AssociationRecord, 'id' | 'referenceId' | 'submittedAt' | 'status' | 'isDemo'>
  ) => AssociationRecord;
  updateAssociation: (id: string, updates: Partial<AssociationRecord>) => void;
  addEventRegistration: (
    data: Omit<EventRegistrationRecord, 'id' | 'referenceId' | 'submittedAt' | 'isDemo'>
  ) => EventRegistrationRecord;
  resetDemoData: () => void;
  // Helpers
  getGrievanceByRef: (ref: string) => GrievanceRecord | undefined;
}

export const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);
