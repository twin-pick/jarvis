export type Movie = {
  id: string;
  title: string;
  date: string;
  director: string;
  poster: string;
  duration: string;
  wantToWatch: boolean | null;
};

export type Result = {
  film : Movie;
  votes : string;
}
