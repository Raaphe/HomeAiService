import IProperty from "./listing.interface";

export default interface IUser {
  email: string;
  password: string;
  userName: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_pic?: string;
  company?: string;
  company_url?: string;
  role: string;
  listings?: IProperty[];
}
