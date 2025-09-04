import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { type Movie } from "@/libs/types";
import styles from "@/styles/party_style";
import { useRoomStore } from '@/store/useRoomStore';
import { useMovieStore } from "@/store/useMovieStore";

const movieList: Movie[] = [
  {
    id: "1",
    title: "Alice au Pays des Merveille",
    date: "2010",
    director: "Tim Burton",
    poster: "https://source.unsplash.com/random/400x600?sig=1",
    duration: "2h30",
    wantToWatch: null,
  },
  {
    id: "2",
    title: "Tennet",
    date: "2020",
    director: "Christopher Nolan",
    poster: "https://source.unsplash.com/random/400x600?sig=2",
    duration: "2h15",
    wantToWatch: null,
  },
  {
    id: "3",
    title: "E.T",
    date: "1982",
    director: "Steven Spielberg",
    poster: "https://source.unsplash.com/random/400x600?sig=3",
    duration: "1h35",
    wantToWatch: null,
  },
];

type RouteParams = {
  roomId: string;
};

const Party = () => {

  const roomId = useRoomStore((state) => state.roomId);
  console.log(roomId)
  const { width, height } = useWindowDimensions();
  const [ socketId, setSocketId ] = useState<string>();
  const [ movies, setMovies ] = useState<Movie[]>([]);
  const position = useRef(new Animated.Value(0)).current;
  const movieResult = useRoomStore((state: { setRoomId: any; }) => state.setRoomId);
  const addMovie = useMovieStore((state: { addMovie: any; }) => state.addMovie)


  const ws = useRef<WebSocket | null>(null);

  // function createMoviesList(data: JSON){
  //   const listMovie = JSON.parse(data)
  //   listMovie.forEach((movie: { id: string; title: string; date: string; director: string; poster: string; duration: string; }) => {
  //     let newMovie: Movie = {
  //       id: movie.id,
  //       title: movie.title,
  //       date: movie.date,
  //       director: movie.director,
  //       poster: movie.poster,
  //       duration: movie.duration,
  //       wantToWatch: null
  //     }
  //   });
  // }

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8085/api/v2/party/room/${roomId}`);
    
    ws.current.onopen = () => console.log("✅ WS connected");

    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📩 message:", msg);

        if (msg.event === 'film_selected') {
          const data = msg.flim
          const newMovie: Movie = {
            id: data.id,
            title: data.title as string,
            date: data.date as string,
            director: data.director as string,
            duration: data.duration as string,
            poster: data.poster as string,
            wantToWatch: true,
          };
          addMovie(newMovie);
          router.push({
            pathname:"/twinpick-result",
          })
        }

        // TODO : Vérif à revoir
        if (msg.event === 'identification') {
          setSocketId(msg.socketId);
        }

        if (msg.event === 'data'){
          const listMovie: Movie[] = msg.films
          setMovies(listMovie);
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.current.onerror = (e) => console.error("❌ WS error:", e);
    ws.current.onclose = () => console.log("🔌 WS closed");

    return () => {
      ws.current?.close();
    };
  }, [roomId]);

  const handleChoice = (isValid: boolean) => {
    const currentMovie = movies[0]
    Animated.timing(position, {
      toValue: isValid ? width : -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMovies((prev) => {
        const updated = [...prev];
        updated[0].wantToWatch = isValid;
        updated.shift();
        return updated;
      });

    ws.current?.send(
      JSON.stringify({
        "filmId": currentMovie.id,
        "wantToWatch": isValid,
        "socketId": socketId,
      })
    );

      position.setValue(0);
    });
  };
  if (movieList.length == 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Twin Pick</Text>

      <View
        style={[
          styles.cardStack,
          { width: width * 0.9, height: height * 0.65 },
        ]}
      >
        {movies
          .slice()
          .reverse()
          .map((movie, index) => {
            const realIndex = movies.length - 1 - index;
            if (realIndex === 0) {
              return (
                <Animated.View
                  key={movie.id}
                  style={[
                    styles.card,
                    {
                      transform: [{ translateX: position }],
                    },
                  ]}
                >
                  <Image source={{ uri: movie.poster }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.name}>
                      {movie.title} ({movie.date})
                    </Text>
                    <Text style={styles.director}>{movie.director}</Text>
                  </View>
                </Animated.View>
              );
            } else {
              return (
                <View
                  key={movie.id}
                  style={[
                    styles.card,
                    {
                      top: realIndex * 8,
                      transform: [{ scale: 1 - realIndex * 0.03 }],
                    },
                  ]}
                >
                  <Image source={{ uri: movie.poster }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.name}>
                      {movie.title} ({movie.date})
                    </Text>
                    <Text style={styles.director}>{movie.director}</Text>
                  </View>
                </View>
              );
            }
          })}
      </View>

      <View style={[styles.buttonsContainer, { width: width * 0.7 }]}>
        <TouchableOpacity onPress={() => handleChoice(false)}>
          <View style={[styles.button, styles.no]}>
            <Text style={styles.buttonText}>❌</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChoice(true)}>
          <View style={[styles.button, styles.yes]}>
            <Text style={styles.buttonText}>❤️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default Party;
