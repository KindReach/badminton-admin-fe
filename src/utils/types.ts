export interface MemberProps {
  user_name: string;
  profile_picture: string;
  is_block: boolean;
  amount_of_no_show: number;
  amount_of_book: number;
  add_time: string;
}

export interface CreateSessionType {
  place_name: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  limit_of_member: number;
  amount_of_court: number;
  price: number;
  description: string;
}
