import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CartPage() {
  const [cartitems, SetCartItems] = useState([]);
  const [currentuser, SetCurrentUser] = useState();
  const [total, SetTotal] = useState(0);
  const router = useRouter();

  const SetAmount = async (item, operation) => {
    let newlist = [...cartitems];
    const index = newlist.findIndex(cartitem => cartitem.name === item.name);

    if (index === -1) return;

    if (operation === "+") {
      newlist[index].amount++;
    } else if (operation === "-") {
      if (newlist[index].amount > 1) {
        newlist[index].amount--;
      } else {
        newlist.splice(index, 1);
      }
    }

    SetCartItems(newlist);
    await AsyncStorage.setItem('@' + currentuser.email + ' cart', JSON.stringify(newlist));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUserCart = async () => {
        const userRaw = await AsyncStorage.getItem('@current_user');
        if (!userRaw) {
          Alert.alert("You must login first");
          router.push('/');
          return;
        }

        const current_user = JSON.parse(userRaw);
        SetCurrentUser(current_user);

        const cartRaw = await AsyncStorage.getItem('@' + current_user.email + ' cart');
        const cart = cartRaw ? JSON.parse(cartRaw) : [];
        SetCartItems(cart);

        // חישוב סך הכל
        let getTotal = 0;
        cart.forEach((item) => {
          if (item != undefined) {
            getTotal += item.price * item.amount;
          }
        });
        SetTotal(getTotal);
      };

      fetchUserCart();
    }, [])
  );

 const Purchase = async () => {
  if (total === 0 || cartitems.length === 0) {
    Alert.alert("Your cart is empty");
    return;
  }

  try {
    const purchaseDate = new Date().toISOString();

    const purchaseData = cartitems.map((item) => ({
      UserEmail: currentuser.email,       
      ItemName: item.name,
      Price: item.price,
      Amount: item.amount,
      PurchaseDate: purchaseDate
    }));

    const response = await fetch("http://BurgerStation.somee.com/api/Users/purchase", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(purchaseData)
});
    console.log("res.status=", response.status);
    if (response.status === 200) {
      Alert.alert("Thank you for your purchase!");
      SetCartItems([]);
      await AsyncStorage.setItem('@' + currentuser.email + ' cart', JSON.stringify([]));
      SetTotal(0);
    } else {
      const errorText = await response.text();
      console.log("Purchase failed:", errorText);
      Alert.alert("Purchase failed", errorText);
    }
  } catch (error) {
    console.error("Error during purchase:", error);
    Alert.alert("Server error", error.message);
  }
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Cart</Text>
      <Text style={styles.total}>Total: {total}₪</Text>

      <View style={styles.cartContainer}>
        {cartitems.map((i) => {
          if (i.name !== "") {
            return (
              <View key={i.name} style={styles.cartItem}>
                <Image source={{ uri: i.Image }} style={styles.image} />
                <Text style={styles.cartItemName}>{i.name}</Text>
                <Text style={styles.cartItemPrice}>Price: {i.price}₪</Text>
                <Text style={styles.cartItemAmount}>Amount: {i.amount}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: 100 }}>
                  <Button color="red" title="+" onPress={() => { SetAmount(i, "+") }} />
                  <Button color="red" title="-" onPress={() => { SetAmount(i, "-") }} />
                </View>
              </View>
            );
          }
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={Purchase}>
        <Text style={styles.buttonText}>Purchase</Text>
      </TouchableOpacity>
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
    color: '#333',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#555',
  },
  cartContainer: {
    marginTop: 20,
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#888',
  },
  cartItemAmount: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
