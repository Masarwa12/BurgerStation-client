import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("All");
  const router = useRouter();
  const categories = ["Burgers", "Fries", "Drinks", "chicken_burger"];

  useFocusEffect(
    useCallback(() => {
      const fetchItems = async () => {
        let user = JSON.parse(await AsyncStorage.getItem('@current_user'));
        if (!user) {
          Alert.alert("You need to login first");
          router.push('/');
          return;
        }

        setCurrentUser(user);

        // Fetch items from server
        try {
          const res = await fetch("http://www.BurgerStation.somee.com/api/Users/items");
          const data = await res.json();
          setAllItems(data);
          setItems(data);
        } catch (error) {
          console.error("Failed to fetch items:", error);
        }

        let cart = JSON.parse(await AsyncStorage.getItem('@' + user.email + ' cart'));
        setCartItems(cart || []);
      };

      fetchItems();
    }, [])
  );

  const filterByCategory = (category) => {
    setTitle(category || "All");
    if (!category) {
      setItems(allItems);
    } else {
      setItems(allItems.filter(item => item.category === category));
    }
  };

  const addToCart = async (item) => {
    let found = false;
    const updatedCart = [...cartItems];

    for (let cartItem of updatedCart) {
      if (cartItem.name === item.name) {
        cartItem.amount += 1;
        found = true;
        break;
      }
    }

    if (!found) {
      updatedCart.push({ ...item, amount: 1 });
    }

    setCartItems(updatedCart);
    await AsyncStorage.setItem('@' + currentUser.email + ' cart', JSON.stringify(updatedCart));
    Alert.alert("Added to cart", `${item.name} added successfully.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Menu - {title}</Text>

      <ScrollView horizontal style={styles.categoryScroll}>
        <TouchableOpacity onPress={() => filterByCategory('')} style={styles.categoryButton}>
          <Image source={require('./menu_icon.png')} style={styles.iconImage} />
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => filterByCategory('Burgers')} style={styles.categoryButton}>
          <Image source={require('./burger_icon.png')} style={styles.iconImage} />
          <Text style={styles.categoryText}>Burgers</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => filterByCategory('Fries')} style={styles.categoryButton}>
          <Image source={require('./fries_icon.png')} style={styles.iconImage} />
          <Text style={styles.categoryText}>Fries</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => filterByCategory('Drinks')} style={styles.categoryButton}>
          <Image source={require('./drink_icon.png')} style={styles.iconImage} />
          <Text style={styles.categoryText}>Drinks</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => filterByCategory('chicken_burger')} style={styles.categoryButton}>
          <Image source={require('./chicken_burger_icon.png')} style={styles.iconImage} />
          <Text style={styles.categoryText}>Chicken</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>Price: {item.price}₪</Text>
            <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
              <Text style={styles.buttonText}><Feather name="plus" size={20} /> Add To Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryScroll: {
    marginBottom: 10,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    elevation: 3,
    width: 100,
  },
  iconImage: {
    width: 50,
    height: 50,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  itemsContainer: {
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    width: '100%',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
