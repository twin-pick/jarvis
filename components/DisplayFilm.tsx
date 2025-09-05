import { Image } from 'react-native';
import { Movie } from '../libs/types';
 
export default function DisplayFilm(film : Movie){
    console.log("flim: " + film);
    console.log(film.title, film.poster, film.director, film.date, film.duration)
    return (
        <div style={{backgroundColor: 'black',color : 'white'}}>
          {film.poster && (
            <Image
              source={{ uri: film.poster as string }}
              style={{ width: 200, height: 300, borderRadius: 12 }}
              resizeMode="cover"
            />
          )}
          <h2>{film.title} ({film.date})</h2>
          <h3>{film.director}, {film.duration}</h3>
        </div>
       
      );
}