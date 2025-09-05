import { create } from "zustand";
import { Movie } from '../libs/types';

type MovieState = {
  movies: Movie | null;
  setMovie: (movie: Movie) => void;
  clearMovies: () => void;
};

export const useMovieStore = create<MovieState>((set) => ({
  movies: null,
  setMovie: (movie) => set({ movies: movie }),
  clearMovies: () => set({ movies: null }),
}));