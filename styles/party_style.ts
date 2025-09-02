import { StyleSheet } from "react-native";

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

export default styles;