export interface Pagination<T> {
  data: T[]; // Dito mapupunta ang array ng Member o Visitor
  meta: {
    current_page: number;
    from: number | null;
    to: number | null;
    last_page: number;
    total: number;
    per_page: number;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}