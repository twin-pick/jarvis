import DisplayFilm from '@/components/DisplayFilmParty';
import { Result } from '@/libs/types';
import { usePartyStore } from '@/store/usePartyStore';
import { ScrollView } from 'react-native';

function sortResults(results: Result[]): Result[] {
  return results.sort((a, b) => {
    const va = parseInt(a.votes, 10) || 0;
    const vb = parseInt(b.votes, 10) || 0;
    return vb - va; // ordre décroissant
  });
}


export default function TwinPickResultScreen() {
  
    const result = usePartyStore((state) => state.result);
    
    /*const result = [
    {
        film:{
        id: "1",
        title: "Alice au Pays des Merveille",
        date: "2010",
        director: "Tim Burton",
        poster: "https://source.unsplash.com/random/400x600?sig=1",
        duration: "2h30",
        wantToWatch: null,
        },
        votes:"3"
    },
    {
        film:{
        id: "2",
        title: "Tennet",
        date: "2020",
        director: "Christopher Nolan",
        poster: "https://source.unsplash.com/random/400x600?sig=2",
        duration: "2h15",
        wantToWatch: null,
        },
        votes:"5"
    },
    {
        film:{
        id: "3",
        title: "E.T",
        date: "1982",
        director: "Steven Spielberg",
        poster: "https://source.unsplash.com/random/400x600?sig=3",
        duration: "1h35",
        wantToWatch: null,
        },
        votes:"4"
    }
    ];*/
    const sortedResult = sortResults(result).slice(0, 10);
    
    return (
        <ScrollView contentContainerStyle={{backgroundColor: 'black'}}>
        {
            sortedResult.map(({film, votes})=>{
                return (DisplayFilm(film, votes))
            })
        }
        </ScrollView>
    );
}