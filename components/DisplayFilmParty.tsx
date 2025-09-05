import { Movie } from '../libs/types';
 
export default function DisplayFilm(film: Movie, votes : string) {
    return (
        <div
        style={{
            display: "grid",
            gridTemplateColumns: "80px 4fr 2fr 1fr", // image / titre+date / réal+durée
            alignItems: "center",
            gap: "15px",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
        }}
        >
        {film.poster && (
            <img
            src={film.poster as string}
            style={{ width: 60, height: 90, borderRadius: 12 }}
            />
        )}

        <h3 style={{ margin: 0 }}>
            {film.title} ({film.date})
        </h3>

        <h3 style={{ margin: 0 }}>
            {film.director}, {film.duration}
        </h3>
        <h3>{votes}</h3>
        </div>
    );
}
