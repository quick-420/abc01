
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
  // Dentists
  { id: 'd1', name: 'Dr. Sarah Miller', specialization: 'Dentist', availability: ['Mon 9am-5pm', 'Wed 1pm-4pm'], avatarUrl: 'https://placehold.co/100x100.png?text=SM', location: 'Bright Smiles Dental', rating: 4.8 },
  { id: 'd2', name: 'Dr. Kevin Lee', specialization: 'Dentist', availability: ['Tue 10am-6pm', 'Thu 8am-2pm'], avatarUrl: 'https://placehold.co/100x100.png?text=KL', location: 'Downtown Dental Care', rating: 4.9 },
  { id: 'd3', name: 'Dr. Olivia Chen', specialization: 'Dentist', availability: ['Mon 9am-1pm', 'Fri 2pm-6pm'], avatarUrl: 'https://placehold.co/100x100.png?text=OC', location: 'Family Dental Center', rating: 4.7 },
  { id: 'd4', name: 'Dr. James Wilson', specialization: 'Dentist', availability: ['Wed 8am-12pm', 'Fri 10am-3pm'], avatarUrl: 'https://placehold.co/100x100.png?text=JW', location: 'Gentle Dental Clinic', rating: 4.6 },
  { id: 'd5', name: 'Dr. Priya Sharma', specialization: 'Dentist', availability: ['Tue 1pm-5pm', 'Thu 9am-1pm'], avatarUrl: 'https://placehold.co/100x100.png?text=PS', location: 'City Dental Hub', rating: 4.8 },

  // Physiotherapists
  { id: 'd6', name: 'Dr. Michael Brown', specialization: 'Physiotherapist', availability: ['Mon 10am-6pm', 'Wed 9am-3pm'], avatarUrl: 'https://placehold.co/100x100.png?text=MB', location: 'Active Life Physio', rating: 4.9 },
  { id: 'd7', name: 'Dr. Emily White', specialization: 'Physiotherapist', availability: ['Tue 8am-4pm', 'Thu 1pm-7pm'], avatarUrl: 'https://placehold.co/100x100.png?text=EW', location: 'Restore Physical Therapy', rating: 4.7 },
  { id: 'd8', name: 'Dr. David Green', specialization: 'Physiotherapist', availability: ['Wed 10am-5pm', 'Fri 9am-2pm'], avatarUrl: 'https://placehold.co/100x100.png?text=DG', location: 'Movement Clinic', rating: 4.8 },
  { id: 'd9', name: 'Dr. Laura Black', specialization: 'Physiotherapist', availability: ['Mon 1pm-7pm', 'Thu 8am-12pm'], avatarUrl: 'https://placehold.co/100x100.png?text=LB', location: 'Wellness Physio Center', rating: 4.6 },
  { id: 'd10', name: 'Dr. Chris Taylor', specialization: 'Physiotherapist', availability: ['Tue 9am-3pm', 'Fri 11am-6pm'], avatarUrl: 'https://placehold.co/100x100.png?text=CT', location: 'Body Balance Therapy', rating: 4.9 },

  // Neurologists
  { id: 'd11', name: 'Dr. Amanda Clark', specialization: 'Neurologist', availability: ['Mon 8am-3pm', 'Thu 10am-5pm'], avatarUrl: 'https://placehold.co/100x100.png?text=AC', location: 'City Neurology Institute', rating: 4.9 },
  { id: 'd12', name: 'Dr. Robert Harris', specialization: 'Neurologist', availability: ['Tue 9am-4pm', 'Fri 1pm-6pm'], avatarUrl: 'https://placehold.co/100x100.png?text=RH', location: 'Brain & Spine Center', rating: 4.8 },
  { id: 'd13', name: 'Dr. Jessica Lewis', specialization: 'Neurologist', availability: ['Wed 11am-7pm', 'Fri 8am-1pm'], avatarUrl: 'https://placehold.co/100x100.png?text=JL', location: 'Advanced Neurology Clinic', rating: 4.7 },
  { id: 'd14', name: 'Dr. Brian Walker', specialization: 'Neurologist', availability: ['Mon 10am-4pm', 'Thu 9am-2pm'], avatarUrl: 'https://placehold.co/100x100.png?text=BW', location: 'Central Nervous System Care', rating: 4.9 },
  { id: 'd15', name: 'Dr. Nancy Allen', specialization: 'Neurologist', availability: ['Tue 12pm-6pm', 'Wed 8am-2pm'], avatarUrl: 'https://placehold.co/100x100.png?text=NA', location: 'Mind Matters Neurology', rating: 4.6 },

  // Homeopathic Doctors
  { id: 'd16', name: 'Dr. Anjali Patel', specialization: 'Homeopathic Doctor', availability: ['Mon 10am-2pm', 'Wed 3pm-7pm'], avatarUrl: 'https://placehold.co/100x100.png?text=AP', location: 'Holistic Harmony Clinic', rating: 4.7 },
  { id: 'd17', name: 'Dr. Rohan Mehra', specialization: 'Homeopathic Doctor', availability: ['Tue 9am-1pm', 'Thu 2pm-6pm'], avatarUrl: 'https://placehold.co/100x100.png?text=RM', location: 'Natural Remedies Center', rating: 4.6 },
  { id: 'd18', name: 'Dr. Sunita Verma', specialization: 'Homeopathic Doctor', availability: ['Fri 10am-4pm'], avatarUrl: 'https://placehold.co/100x100.png?text=SV', location: 'Gentle Healing Homeopathy', rating: 4.8 },
  
  // Ayurvedic Doctors
  { id: 'd19', name: 'Dr. Vikram Singh', specialization: 'Ayurvedic Doctor', availability: ['Mon 9am-3pm', 'Thu 11am-5pm'], avatarUrl: 'https://placehold.co/100x100.png?text=VS', location: 'Veda Life Ayurveda', rating: 4.9 },
  { id: 'd20', name: 'Dr. Lakshmi Rao', specialization: 'Ayurvedic Doctor', availability: ['Tue 10am-4pm', 'Fri 12pm-6pm'], avatarUrl: 'https://placehold.co/100x100.png?text=LR', location: 'Ancient Wisdom Healing', rating: 4.7 },
  { id: 'd21', name: 'Dr. Deepak Joshi', specialization: 'Ayurvedic Doctor', availability: ['Wed 8am-2pm'], avatarUrl: 'https://placehold.co/100x100.png?text=DJ', location: 'Prakriti Ayurveda Clinic', rating: 4.8 },

  // Original doctors (can be updated or kept)
  { id: 'd22', name: 'Dr. Evelyn Reed', specialization: 'Cardiology', availability: ['Mon 9am-5pm', 'Wed 1pm-4pm'], avatarUrl: 'https://placehold.co/100x100.png?text=ER', location: 'City General Hospital', rating: 4.8 },
  { id: 'd23', name: 'Dr. Marcus Chen', specialization: 'Pediatrics', availability: ['Tue 10am-6pm', 'Thu 8am-2pm'], avatarUrl: 'https://placehold.co/100x100.png?text=MC', location: 'Childrens Clinic', rating: 4.9 },
  { id: 'd24', name: 'Dr. Olivia Grant', specialization: 'Dermatology', availability: ['Mon 9am-1pm', 'Fri 2pm-6pm'], avatarUrl: 'https://placehold.co/100x100.png?text=OG', location: 'Downtown Medical Center', rating: 4.7 },
];


export const mockMedicalRecords = [
  { id: 'mr1', title: 'Annual Checkup Report', date: '2023-08-15', doctor: 'Dr. Smith', type: 'Report' },
  { id: 'mr2', title: 'X-Ray Results - Left Arm', date: '2023-05-02', doctor: 'Dr. Jones', type: 'Imaging' },
  { id: 'mr3', title: 'Blood Test Panel', date: '2024-01-10', doctor: 'Dr. Anya Sharma', type: 'Lab Result' },
];


    