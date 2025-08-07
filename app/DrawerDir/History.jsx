import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const rawUser = await AsyncStorage.getItem('@current_user');

        if (!rawUser) {
          Alert.alert("You must login first");
          router.push('/');
          return;
        }

        const user = JSON.parse(rawUser);
        if (!user.email) {
          throw new Error("Invalid user data");
        }

        console.log("Fetching history for:", user.email);

        const response = await fetch(`http://www.BurgerStation.somee.com/api/Users/purchase/history/${user.email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch purchase history");
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err.message);
        Alert.alert("Error", "Failed to load purchase history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Purchase History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : history.length === 0 ? (
        <Text style={styles.empty}>No purchases found.</Text>
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.textBold}>Item: {item.itemName}</Text>
            <Text>Price: {item.price}₪</Text>
            <Text>Amount: {item.amount}</Text>
            <Text>Date: {new Date(item.purchaseDate).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  empty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  textBold: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
