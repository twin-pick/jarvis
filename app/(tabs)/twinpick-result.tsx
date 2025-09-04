import DisplayFilm from '@/components/DisplayFilm';
import { useMovieStore } from '@/store/useMovieStore';
import { ScrollView } from 'react-native';
import { Movie } from '@/libs/types';
 
export default function TwinPickResultScreen() {
  const movie = useMovieStore((state) => state.movies);
  console.log("la data du result : ");
  console.log(movie);
 
 
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, alignItems: 'center'}}>
      {
        DisplayFilm(movie!)
      }
    </ScrollView>
  );
}