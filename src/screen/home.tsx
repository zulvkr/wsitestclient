import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useSWR from 'swr';
import {fetcher} from '../utils/fetcher';
import {IBook} from '../api/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';

export default function Home({}: {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}) {
  const {isConnected} = useNetInfo();
  const {data, isLoading, mutate, isValidating} = useSWR('books', () =>
    fetcher.get('books').json<{
      data: IBook[];
    }>(),
  );

  const [storedData, setStoredData] = useState<typeof data | null>();

  const storeData = useCallback(async (value: any) => {
    try {
      await AsyncStorage.setItem('books', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      AsyncStorage.getItem('books').then(data => {
        if (data) {
          setStoredData(JSON.parse(data));
        }
      });
    }
    if (isConnected) {
      mutate();
      setStoredData(null);
    }
  }, [isConnected, mutate]);

  useEffect(() => {
    if (data) {
      storeData(data);
    }
  });

  const shownData = !isConnected && storedData ? storedData : data;
  console.log({
    isConnected,
    shownData,
  });

  return (
    <View
      style={{
        height: ' 100%',
      }}>
      {!isConnected && (
        <View
          style={{
            backgroundColor: '#cecece',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#0c0c0c',
            }}>
            Offline
          </Text>
        </View>
      )}
      {isValidating && (
        <View
          style={{
            backgroundColor: '#add8e6',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'rgba(0,0,0,0.5)',
            }}>
            Mengupdate
          </Text>
        </View>
      )}
      {isLoading && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <ActivityIndicator size={32} />
        </View>
      )}
      {/* {error && <Text>Error...</Text>} */}
      {shownData && (
        <FlatList
          data={shownData.data.sort((a, b) => b.tahun_terbit - a.tahun_terbit)}
          contentContainerStyle={{paddingBottom: 100, paddingTop: 10}}
          renderItem={({item}) => <BookCard data={item} />}
          keyExtractor={item => item.id.toString()}
        />
      )}
      {isConnected && <AddButton />}
    </View>
  );
}

const BookCard = ({data}: {data: IBook}) => {
  const {isConnected} = useNetInfo();
  const navigation = useNavigation<NativeStackScreenProps<any>['navigation']>();
  const pressHandler = () => {
    if (isConnected) {
      navigation.navigate('Add', {
        isEdit: true,
        bookData: data,
      });
    } else {
      Alert.alert('Tidak bisa mengubah data saat offline');
    }
  };

  return (
    <TouchableNativeFeedback onPress={pressHandler}>
      <View style={styles.card}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {data.judul_buku}
        </Text>
        <Text style={styles.cardSubtitle}>{data.nama_pengarang}</Text>
        <Text style={styles.cardBookCode}>#{data.kode_buku}</Text>
        <Text style={styles.cardBookFooter}>
          {data.nama_penerbit} · {data.tahun_terbit}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 1,
    margin: 4,
    marginHorizontal: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.9)',
  },
  cardSubtitle: {
    fontSize: 14,
  },
  cardBookCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  cardBookFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    fontSize: 12,
  },
});

export const AddButton = () => {
  const navigation = useNavigation<NativeStackScreenProps<any>['navigation']>();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback onPress={() => navigation.navigate('Add')}>
        <View
          style={{
            backgroundColor: '#00c853',
            width: 56,
            height: 56,
            borderRadius: 28,
            elevation: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 32,
              color: 'white',
            }}>
            +
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
