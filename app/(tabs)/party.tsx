import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { type Movie } from "@/libs/types";
import styles from "@/styles/party_style";

const movieList: Movie[] = [
  {
    id: 1,
    name: "Alice au Pays des Merveille",
    date: 2010,
    director: "Tim Burton",
    poster: "https://source.unsplash.com/random/400x600?sig=1",
    wantToWatch: null,
  },
  {
    id: 2,
    name: "Tennet",
    date: 2020,
    director: "Christopher Nolan",
    poster: "https://source.unsplash.com/random/400x600?sig=2",
    wantToWatch: null,
  },
  {
    id: 3,
    name: "E.T",
    date: 1982,
    director: "Steven Spielberg",
    poster: "https://source.unsplash.com/random/400x600?sig=3",
    wantToWatch: null,
  },
];

const Party = () => {
  const { width, height } = useWindowDimensions();
  const [movies, setMovies] = useState(movieList);
  const position = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
  const ws = useRef<WebSocket | null>(null);

  // --- Connexion WS ---
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/ws");

    ws.current.onopen = () => console.log("✅ WS connected");

    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📩 message:", msg);

        if (msg.type === "MovieFound") {
          navigation.navigate("ResultScreen", { movie: msg.data });
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
  }, []);

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

      socket.emit("vote", {
        id: currentMovie.id,
        wantToWatch: isValid,
      });

      position.setValue(0);
    });
  };

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
                      {movie.name} ({movie.date})
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
                      {movie.name} ({movie.date})
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
