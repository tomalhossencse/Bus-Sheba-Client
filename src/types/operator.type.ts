export interface OperatorPayload {
  name: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
  nidNumber: string;
  tradeLicenseNo: string;
  businessRegistrationNo: string;
  taxIdentificationNo: string;
  nidDocument: File;
  tradeLicenseDocument: File;
  additionalDocuments: File[];
}
