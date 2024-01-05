import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React from 'react';
import useSWR from 'swr';
import {fetcher} from '../utils/fetcher';
import {IBook} from '../api/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export default function Home({}: {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}) {
  const {data, error, isLoading} = useSWR('books', () =>
    fetcher.get('books').json<{
      data: IBook[];
    }>(),
  );

  return (
    <View>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error...</Text>}
      {data && (
        <FlatList
          data={data.data.sort((a, b) => b.tahun_terbit - a.tahun_terbit)}
          contentContainerStyle={{paddingBottom: 100, paddingTop: 10}}
          renderItem={({item}) => <BookCard data={item} />}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <AddButton />
    </View>
  );
}

const BookCard = ({data}: {data: IBook}) => {
  const navigation = useNavigation<NativeStackScreenProps<any>['navigation']>();
  const pressHandler = () => {
    navigation.navigate('Add', {
      isEdit: true,
      bookData: data,
    });
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

  // an FAB Button
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
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
          fontWeight: 'bold',
        }}
        onPress={() => navigation.navigate('Add')}>
        +
      </Text>
    </View>
  );
};
