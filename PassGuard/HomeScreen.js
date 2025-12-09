import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  FlatList,
  Modal,
  TextInput,
  Pressable
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import * as Clipboard from 'expo-clipboard';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPasswords, deletePassword } from './passwordService';
import { decryptBase64 } from './encryption';

export default function HomeScreen({ route, navigation }) {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Cargar contraseñas al iniciar
  useEffect(() => {
    navigation.addListener('focus', () => {
      loadPasswords(); // Se ejecuta cada vez que entra a esta pantalla
    });
  }, []);

  const loadPasswords = async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const passwordsList = await getPasswords(userId);

        setPasswords(passwordsList || []);
      }
    } catch (error) {
      console.error('Error cargando contraseñas:', error);
      Alert.alert('Error', 'No se pudieron cargar las contraseñas');
    }
    setLoading(false);
  };

  // Filtrar contraseñas por búsqueda
  const filteredPasswords = passwords.filter(password =>
    password.service.toLowerCase().includes(searchText.toLowerCase()) ||
    password.username.toLowerCase().includes(searchText.toLowerCase())
  );

  // Ver contraseña (desencriptar y mostrar)
  const viewPassword = (item) => {
    try {
      const encryptedText = item.encryptedPassword || item.password;

      const decrypted = decryptBase64(encryptedText);

      // Crea un objeto temporal para mostrarlo en el modal
      const passwordToShow = {
        ...item,
        decryptedValue: decrypted // Guarda el valor
      };

      setSelectedPassword(passwordToShow);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo desencriptar la contraseña. Verifica tu clave.');
    }
  };

  // Eliminar contraseña con confirmación
  const handleDelete = async (passwordId) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar esta contraseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const userId = auth.currentUser?.uid;
            if (userId) {
              const result = await deletePassword(userId, passwordId);
              if (result.success) {
                Alert.alert('Éxito', 'Contraseña eliminada');
                loadPasswords(); // Recargar lista
              } else {
                Alert.alert('Error', result.error);
              }
            }
          }
        }
      ]
    );
  };

  // Copiar al portapapeles
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copiado', 'Texto copiado al portapapeles');
    setModalVisible(false);
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  // Renderizar cada item de la lista
  const renderPasswordItem = ({ item }) => (
    <View style={styles.passwordItem}>
      <View style={styles.passwordInfo}>
        <Text style={styles.serviceText}>{item.service}</Text>
        <Text style={styles.usernameText}>{item.username}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => viewPassword(item)}
        >
          <Ionicons name="eye" size={22} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditPassword', { passwordId: item.id, passwordData: item })}
        >
          <FontAwesome name="edit" size={20} color="#FF9500" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <MaterialIcons name="delete" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Imagen logo */}
      <Image
        source={require('./assets/itq.png')}
        style={styles.topLeftImage}
      />

      <Text style={styles.title}> Mis Contraseñas</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar contraseñas..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Contador */}
      <Text style={styles.counter}>
        {filteredPasswords.length} contraseña{filteredPasswords.length !== 1 ? 's' : ''} guardada{filteredPasswords.length !== 1 ? 's' : ''}
      </Text>

      {/* Lista de contraseñas */}
      {loading ? (
        <Text style={styles.loadingText}>Cargando contraseñas...</Text>
      ) : filteredPasswords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={60} color="#666" />
          <Text style={styles.emptyText}>
            {searchText ? 'No se encontraron resultados' : 'No hay contraseñas guardadas'}
          </Text>
          {!searchText && (
            <Text style={styles.emptySubtext}>
              Presiona el botón "+" para agregar tu primera contraseña
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredPasswords}
          renderItem={renderPasswordItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Botones de acción */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPassword')}
        >
          <FontAwesome name="plus" size={20} color="white" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para ver contraseña */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contraseña de {selectedPassword?.service}</Text>
            <Text style={styles.modalUsername}>{selectedPassword?.username}</Text>

            <View style={styles.passwordDisplay}>
              <Text style={styles.passwordText}>
                {showPassword ? (selectedPassword?.decryptedValue || 'Error') : '••••••••••••'}
              </Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#007AFF"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.copyButton]}
                onPress={() => copyToClipboard(selectedPassword?.decryptedValue)}
              >
                <Text style={styles.modalButtonText}>Copiar Contraseña</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 20,
  },
  topLeftImage: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34C759',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  counter: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  passwordItem: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordInfo: {
    flex: 1,
  },
  serviceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  usernameText: {
    color: '#888',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    padding: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#1C1C1C',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalUsername: {
    color: '#888',
    textAlign: 'center',
    marginBottom: 25,
  },
  passwordDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  passwordText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#34C759',
  },
  closeButton: {
    backgroundColor: '#666',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});