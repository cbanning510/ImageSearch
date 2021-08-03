import { BackgroundColor, black } from 'chalk';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Modal, Image, FlatList, Button, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

const API_KEY = "10697894-2d7819c9ffbcf997b340e787a";
const API_URL = "https://pixabay.com/api/";

const App = () => {
  const [searchTerm, onChangeSearchTerm] = useState("");
  const [picsData, setPicsData] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: 'pink'
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const showModal = (item) => {
    setSelectedImage(item);
    setModalVisible(true);
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={(e) => showModal(item)}>
        <Image
          style={styles.image}
          source={{ uri: item.previewURL }}
        />
      </TouchableOpacity>
    )
  };

  const fetchMorePics = () => {
    setLoadingMore(true);
    setPage(page + 1);
    fetchPics();
  }

  const fetchPics = async () => {
    try {
      const response = await fetch(
        `${API_URL}?key=${API_KEY}&q=${searchTerm}&image_type=photo&page=${page}`,
      );
      const results = await response.json();
      setPicsData(picsData.concat(results.hits));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeContainer}>
            <Text style={styles.closeButton}>x</Text>
          </TouchableOpacity>
          <Image
            style={styles.modalImage}
            source={{ uri: selectedImage?.largeImageURL }}
          />
          <Text style={styles.author}>{`photo by ${selectedImage?.user}`}</Text>
        </View>
      </Modal>
      <View style={styles.container}>
        <Text style={styles.title}>Image Search</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeSearchTerm}
          placeholder='Enter Search Term'
          value={searchTerm}
        />
        <TouchableOpacity style={styles.button} onPress={() => fetchPics()}>
          <Text style={{ color: 'white', fontSize: 18 }}>Search</Text>
        </TouchableOpacity>
        <View style={styles.picsContainer}>
          <FlatList
            data={picsData}
            renderItem={renderItem}
            keyExtractor={(item, idx) => `${item.id + idx}`}
            extraData={picsData}
            numColumns={2}
            onEndReachedThreshold={0.5}
            onEndReached={fetchMorePics}
            ListFooterComponent={renderFooter}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  picsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
  },
  title: {
    fontSize: 28,
    color: 'dodgerblue',
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 10,
  },
  image: {
    height: 150,
    width: 150,
    margin: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  modalImage: {
    height: 300,
    width: 300,
    margin: 20,
    padding: 40,
    borderRadius: 5,
  },
  button: {
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 10,
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: 'dodgerblue'
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  closeContainer: {
    flex: .15,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  closeButton: {
    color: 'white',
    fontSize: 40,
  },
  author: {
    color: 'white',
    fontSize: 22,
  },
})

export default App;
