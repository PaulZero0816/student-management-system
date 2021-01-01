export interface Student {
  id: number;
  name: string;
  orgId: number;
  joinTime: string;
  comment: string;
  status: StudentStatus;
  phone: string;
  wechat: string;
}

export interface Organization {
  id: number;
  name: string;
}

export enum StudentStatus {
  ACTIVE = "active",
}
