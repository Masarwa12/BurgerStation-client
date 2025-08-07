import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function AddItem() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
    const apiUrlCategory = "http://www.BurgerStation.somee.com/api/Users/categories/";
    const apiUrIItem = "http://www.BurgerStation.somee.com/api/Users/item/Add";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(apiUrlCategory);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(`data:image/jpg;base64,${result.assets[0].base64}`);
    }
  };

  const handleAdd = async () => {
    if (!name || !price || !category || !image) {
      Alert.alert('Missing fields', 'Please fill all fields and take a photo.');
      return;
    }

    const newItem = {
      name,
      price: parseInt(price),
      category,
      description,
      image,
    };
console.log("Submitting:", newItem);

    try {
      setLoading(true);
      const res = await fetch(apiUrIItem, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (res.status === 201) {
        Alert.alert('Success', 'Item added successfully!');
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
        setImage(null);
      } else {
        Alert.alert('Error', 'Failed to add item');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Price</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>Category</Text>
   <Picker
  selectedValue={category}
  style={styles.input}
  onValueChange={(itemValue) => setCategory(itemValue)}
>
  <Picker.Item label="Select category" value="" />
  {categories.map((cat, index) => (
    <Picker.Item label={cat} value={cat} key={index} />
  ))}
</Picker>


      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Button title="Take Photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Add Item" onPress={handleAdd} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    alignSelf: 'center',
  },
});
