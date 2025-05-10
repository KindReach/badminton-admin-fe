export interface MemberProps {
  user_id: string;
  user_name: string;
  profile_picture: string;
  is_blocked: boolean;
  amount_of_no_show: number;
  amount_of_book: number;
  add_time: string;
}

export interface CreateSessionType {
  place_name: string;
  location: string;
  region: string;
  date: string;
  start_time: string;
  end_time: string;
  limit_of_member: number;
  amount_of_court: number;
  price: number;
  description: string;
  is_public: boolean;
  categories: string[]; // 新增場次分類欄位
}
