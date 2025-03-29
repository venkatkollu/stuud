import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getEvents } from '../services/supabase';
import { Event } from '../types';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Sample events for initial UI
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'Annual Tech Fest',
      description: 'Join us for the annual technology festival with workshops, competitions, and more!',
      startDate: '2023-12-15',
      endDate: '2023-12-17',
      location: 'Main Auditorium'
    },
    {
      id: '2',
      title: 'Career Fair',
      description: 'Meet recruiters from top companies and explore job opportunities.',
      startDate: '2023-11-20',
      endDate: '2023-11-20',
      location: 'College Ground'
    }
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          defaultSource={require('../../assets/logo.png')}
        />
        <Text style={styles.title}>Stuud</Text>
        <Text style={styles.subtitle}>Your College Assistant</Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Chat' as never)}
          >
            <Text style={styles.actionButtonText}>Ask Chatbot</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Map' as never)}
          >
            <Text style={styles.actionButtonText}>Find Classroom</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Search' as never)}
          >
            <Text style={styles.actionButtonText}>Search Faculty</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : (
          displayEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <View style={styles.eventDetails}>
                <Text style={styles.eventDate}>
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </Text>
                {event.location && (
                  <Text style={styles.eventLocation}>Location: {event.location}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity 
        style={styles.adminButton}
        onPress={() => navigation.navigate('Admin' as never)}
      >
        <Text style={styles.adminButtonText}>Admin Panel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4F46E5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventsSection: {
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  eventDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#4F46E5',
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  adminButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen; 