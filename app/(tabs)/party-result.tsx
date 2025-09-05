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

    result.map((film, result) => {
        if (result === null) {
            
        }
    })
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