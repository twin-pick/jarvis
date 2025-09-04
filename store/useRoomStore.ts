import { create } from 'zustand';
import { Movie } from '../libs/types';

type MovieState = {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (id: string) => void;
  clearMovies: () => void;
};

export const useMovieStore = create<MovieState>((set) => ({
  movies: [],
  addMovie: (movie) =>
    set((state) => ({
      movies: [...state.movies, movie],
    })),
  removeMovie: (id) =>
    set((state) => ({
      movies: state.movies.filter((m) => m.id !== id),
    })),
  clearMovies: () => set({ movies: [] }),
}));

type RoomState = {
  roomId: string | null;
  setRoomId: (id: string) => void;
  clearRoomId: () => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  setRoomId: (id) => set({ roomId: id }),
  clearRoomId: () => set({ roomId: null }),
}));

