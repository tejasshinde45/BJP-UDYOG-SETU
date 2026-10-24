export type Language = 'mr' | 'en' | 'hi';

export interface MetricItem {
  id: string;
  labelMr: string;
  labelEn: string;
  labelHi: string;
  value: string;
  change?: string;
  isDemoSample: boolean;
  color: 'primary' | 'secondary' | 'tertiary';
}

export interface ServiceCardItem {
  id: string;
  titleMr: string;
  titleEn: string;
  titleHi: string;
  descriptionMr: string;
  descriptionEn: string;
  descriptionHi: string;
  iconName: string;
  badgeMr: string;
  badgeEn: string;
  badgeHi: string;
  ctaTextMr: string;
  ctaTextEn: string;
  ctaTextHi: string;
  accentColor: 'primary' | 'secondary' | 'tertiary';
  route?: string;
}

export interface EventItem {
  id: string;
  titleMr: string;
  titleEn: string;
  titleHi: string;
  date: string;
  time?: string;
  locationMr: string;
  locationEn: string;
  locationHi: string;
  categoryMr: string;
  categoryEn: string;
  categoryHi: string;
  category?: 'samvaad' | 'darshan' | 'niti' | 'summit';
  district?: string;
  descriptionMr?: string;
  descriptionEn?: string;
  descriptionHi?: string;
  agenda?: string[];
  eligibilityMr?: string;
  eligibilityEn?: string;
  eligibilityHi?: string;
  capacity?: number;
  registeredCount?: number;
  status?: 'upcoming' | 'completed' | 'ongoing';
  imageUrl?: string;
  isDemoSample: boolean;
}

export interface EcosystemPillar {
  id: string;
  titleMr: string;
  titleEn: string;
  titleHi: string;
  summaryMr: string;
  summaryEn: string;
  summaryHi: string;
  percentage: number;
  color: 'primary' | 'secondary' | 'tertiary';
}

export interface LeadershipItem {
  id: string;
  nameMr: string;
  nameHi: string;
  nameEn: string;
  roleMr: string;
  roleHi: string;
  roleEn: string;
  messageMr: string;
  messageHi: string;
  messageEn: string;
  image: string;
}

// -------------------------------------------------------------
// Grievance Types
// -------------------------------------------------------------
export type GrievanceCategory =
  | 'midc_infrastructure'
  | 'roads_transport'
  | 'electricity_utilities'
  | 'permissions_approvals'
  | 'industrial_services'
  | 'other';

export type GrievanceStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'Action in Progress'
  | 'Awaiting Information'
  | 'Resolved';

export interface FollowUpRecord {
  id: string;
  followUpNumber: 1 | 2 | number;
  submittedAt: string;
  author: string;
  comment: string;
  statusBefore?: GrievanceStatus;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: GrievanceStatus;
  actor?: string;
}

export interface GrievanceRecord {
  id: string;
  referenceId: string;
  submittedAt: string;
  businessName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  industryType: string;
  district: string;
  locationArea: string;
  category: GrievanceCategory;
  subject: string;
  description: string;
  departmentCategory: string;
  incidentPeriod?: string;
  attachments: { name: string; size: number }[];
  status: GrievanceStatus;
  assignedCoordinator?: string;
  assignedTeam?: string;
  internalNotes?: string[];
  followUps: FollowUpRecord[];
  timeline: TimelineEvent[];
  isDemo: boolean;
}

// -------------------------------------------------------------
// Leadership Meeting Request Types
// -------------------------------------------------------------
export type MeetingRequestStatus =
  | 'Pending Review'
  | 'Under Review'
  | 'Approved'
  | 'Declined'
  | 'Scheduled';

export interface MeetingRequestRecord {
  id: string;
  referenceId: string;
  submittedAt: string;
  businessName: string;
  representativeName: string;
  designation: string;
  industrySector: string;
  district: string;
  email: string;
  phone: string;
  preferredLeader: string;
  meetingPurpose: string;
  preferredFormat: 'mumbai_delegation' | 'regional_conclave' | 'virtual_video';
  supportingContext?: string;
  status: MeetingRequestStatus;
  decisionNote?: string;
  isDemo: boolean;
}

// -------------------------------------------------------------
// Association Registration Types
// -------------------------------------------------------------
export type AssociationVerificationStatus =
  | 'Pending Verification'
  | 'Under Review'
  | 'Verified'
  | 'Declined';

export interface AssociationRecord {
  id: string;
  referenceId: string;
  submittedAt: string;
  associationName: string;
  associationType: string;
  industrySector: string;
  district: string;
  operatingRegion: string;
  representativeName: string;
  designation: string;
  email: string;
  phone: string;
  membershipCount?: number;
  description: string;
  website?: string;
  status: AssociationVerificationStatus;
  internalNote?: string;
  isDemo: boolean;
}

// -------------------------------------------------------------
// Event Registration Types
// -------------------------------------------------------------
export interface EventRegistrationRecord {
  id: string;
  referenceId: string;
  submittedAt: string;
  eventId?: string;
  eventTitle: string;
  eventType: 'samvaad' | 'darshan' | 'niti' | 'summit';
  participantName: string;
  businessName: string;
  designation: string;
  sector: string;
  district: string;
  email: string;
  phone: string;
  policyTopic?: string;
  customQuestionsOrNotes?: string;
  isDemo: boolean;
}
