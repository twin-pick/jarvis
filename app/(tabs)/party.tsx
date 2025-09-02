import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import io from "socket.io-client"

type Movie = {
  id: number;
  name: string;
  date: number;
  director: string;
  poster: string;
  like: boolean | null;
};



const movieList: Movie[] = [
  {
    id: 1,
    name: "Alice au Pays des Merveille",
    date: 2010,
    director: "Tim Burton",
    poster: "https://source.unsplash.com/random/400x600?sig=1",
    like: null,
  },
  {
    id: 2,
    name: "Tennet",
    date: 2020,
    director: "Christopher Nolan",
    poster: "https://source.unsplash.com/random/400x600?sig=2",
    like: null,
  },
  {
    id: 3,
    name: "E.T",
    date: 1982,
    director: "Steven Spielberg",
    poster: "https://source.unsplash.com/random/400x600?sig=3",
    like: null,
  },
];

const Party = () => {
  const { width, height } = useWindowDimensions();
  const [movies, setMovies] = useState(movieList);
  const position = useRef(new Animated.Value(0)).current;

  const socket = useRef(io("http://localhost:3000")).current;

  useEffect(() => {
    return () => {
      socket.disconnect(); // cleanup si on quitte l'écran
    };
  }, []);

  const handleChoice = (isValid: boolean) => {
    Animated.timing(position, {
      toValue: isValid ? width : -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMovies((prev) => {
        const updated = [...prev];
        updated[0].like = isValid;
        updated.shift();
        return updated;
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

const BUTTON_SIZE = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardStack: {
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "85%",
    resizeMode: "cover",
  },
  info: {
    padding: 16,
    backgroundColor: "white",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
  },
  director: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 40,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  no: {
    backgroundColor: "#fda4af",
  },
  yes: {
    backgroundColor: "#4ade80",
  },
  buttonText: {
    fontSize: 30,
  },
});

export default Party;
