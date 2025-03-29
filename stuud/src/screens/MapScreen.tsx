import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getClassrooms, getFaculty } from '../services/supabase';
import { Classroom, Faculty } from '../types';

const MapScreen = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomsData, facultyData] = await Promise.all([
          getClassrooms(),
          getFaculty(),
        ]);
        setClassrooms(classroomsData);
        setFaculty(facultyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sample classrooms for initial UI
  const sampleClassrooms: Classroom[] = [
    {
      id: '1',
      name: 'Room 101',
      location: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      building: 'Main Building',
      floor: 1,
    },
    {
      id: '2',
      name: 'Room 202',
      location: {
        latitude: 37.78925,
        longitude: -122.4344,
      },
      building: 'Science Block',
      floor: 2,
    },
  ];

  const displayClassrooms = classrooms.length > 0 ? classrooms : sampleClassrooms;

  const handleMarkerPress = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setModalVisible(true);
  };

  const getFacultyForClassroom = (classroomName: string) => {
    return faculty.filter(f => f.cabin === classroomName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Map</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: displayClassrooms[0]?.location.latitude || 37.78825,
            longitude: displayClassrooms[0]?.location.longitude || -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {displayClassrooms.map((classroom) => (
            <Marker
              key={classroom.id}
              coordinate={{
                latitude: classroom.location.latitude,
                longitude: classroom.location.longitude,
              }}
              title={classroom.name}
              description={`${classroom.building}, Floor ${classroom.floor}`}
              onPress={() => handleMarkerPress(classroom)}
            />
          ))}
        </MapView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            {selectedClassroom && (
              <>
                <Text style={styles.modalTitle}>{selectedClassroom.name}</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedClassroom.building}, Floor {selectedClassroom.floor}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Faculty in this location:</Text>
                {getFacultyForClassroom(selectedClassroom.name).length > 0 ? (
                  <FlatList
                    data={getFacultyForClassroom(selectedClassroom.name)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={styles.facultyItem}>
                        <Text style={styles.facultyName}>{item.name}</Text>
                        <Text style={styles.facultySubjects}>
                          Subjects: {item.subjects.join(', ')}
                        </Text>
                        {item.email && (
                          <Text style={styles.facultyContact}>Email: {item.email}</Text>
                        )}
                        {item.phone && (
                          <Text style={styles.facultyContact}>Phone: {item.phone}</Text>
                        )}
                      </View>
                    )}
                  />
                ) : (
                  <Text style={styles.noFacultyText}>No faculty assigned to this location.</Text>
                )}

                <TouchableOpacity style={styles.directionsButton}>
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  facultyItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  facultyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  facultySubjects: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  facultyContact: {
    fontSize: 14,
    color: '#666',
  },
  noFacultyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  directionsButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen; 