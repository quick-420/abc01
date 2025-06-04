export interface Appointment {
  id: string;
  patientName?: string;
  doctorName?: string;
  date: string;
  time: string;
  reason?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Patient {
  id:string;
  name: string;
  age: number;
  lastVisit: string;
  avatarUrl?: string;
  email: string;
  phone: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: string[];
  avatarUrl?: string;
  location: string;
  rating: number;
}

export const mockAppointments: Appointment[] = [
  { id: '1', patientName: 'Alice Wonderland', doctorName: 'Dr. Smith', date: '2024-08-15', time: '10:00 AM', reason: 'Annual Checkup', status: 'Scheduled' },
  { id: '2', patientName: 'Bob The Builder', doctorName: 'Dr. Jones', date: '2024-08-16', time: '02:30 PM', reason: 'Follow-up', status: 'Scheduled' },
  { id: '3', patientName: 'Charlie Brown', doctorName: 'Dr. Smith', date: '2024-07-20', time: '11:00 AM', reason: 'Flu Symptoms', status: 'Completed' },
  { id: '4', doctorName: 'Dr. Emily Carter', date: '2024-08-20', time: '09:00 AM', reason: 'Consultation', status: 'Scheduled' },
  { id: '5', doctorName: 'Dr. Benjamin Lee', date: '2024-08-22', time: '03:00 PM', reason: 'Dental Checkup', status: 'Scheduled' },
];

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'Alice Wonderland', age: 30, lastVisit: '2023-08-15', avatarUrl: 'https://placehold.co/100x100.png', email: 'alice@example.com', phone: '555-1234' },
  { id: 'p2',name: 'Bob The Builder', age: 45, lastVisit: '2024-02-10', avatarUrl: 'https://placehold.co/100x100.png', email: 'bob@example.com', phone: '555-5678'  },
  { id: 'p3',name: 'Charlie Brown', age: 8, lastVisit: '2024-07-20', avatarUrl: 'https://placehold.co/100x100.png', email: 'charlie@example.com', phone: '555-9012'  },
];

export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Evelyn Reed', specialization: 'Cardiology', availability: ['Mon 9am-5pm', 'Wed 1pm-4pm'], avatarUrl: 'https://placehold.co/100x100.png', location: 'City General Hospital', rating: 4.8 },
  { id: 'd2', name: 'Dr. Marcus Chen', specialization: 'Pediatrics', availability: ['Tue 10am-6pm', 'Thu 8am-2pm'], avatarUrl: 'https://placehold.co/100x100.png', location: 'Childrens Clinic', rating: 4.9 },
  { id: 'd3', name: 'Dr. Olivia Grant', specialization: 'Dermatology', availability: ['Mon 9am-1pm', 'Fri 2pm-6pm'], avatarUrl: 'https://placehold.co/100x100.png', location: 'Downtown Medical Center', rating: 4.7 },
];

export const mockMedicalRecords = [
  { id: 'mr1', title: 'Annual Checkup Report', date: '2023-08-15', doctor: 'Dr. Smith', type: 'Report' },
  { id: 'mr2', title: 'X-Ray Results - Left Arm', date: '2023-05-02', doctor: 'Dr. Jones', type: 'Imaging' },
  { id: 'mr3', title: 'Blood Test Panel', date: '2024-01-10', doctor: 'Dr. Anya Sharma', type: 'Lab Result' },
];
