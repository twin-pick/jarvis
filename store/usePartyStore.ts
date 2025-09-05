import { create } from "zustand";
import { Movie } from '../libs/types';

type PartyState = {
  result: {film:Movie, votes:string}[];
  addMovie: ({film ,votes} : {film : Movie, votes : string}) => void;
  removeMovie: (id: string) => void;
  cleanMovies: () => void;
  clearMovies: () => void;
};

export const usePartyStore = create<PartyState>((set) => ({
  result: [],
  addMovie: ({film, votes}) =>
    set((state) => ({
      result: [...state.result, {film, votes}],
    })),
  removeMovie: (id) =>
    set((state) => ({
      result: state.result.filter((m) => m.film.id !== id),
    })),
  cleanMovies: () =>
    set((state) => ({
      result: state.result.filter(
        (m) => m.film && m.film.id && m.film.title
      ),
    })),
  clearMovies: () => set({ result: [] }),
}));