import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFaculty } from '../services/supabase';
import { generateSearchSuggestions } from '../services/openai';
import { Faculty } from '../types';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyData = await getFaculty();
        setFaculty(facultyData);
        setFilteredFaculty(facultyData);
      } catch (error) {
        console.error('Error fetching faculty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  // Sample faculty for initial UI
  const sampleFaculty: Faculty[] = [
    {
      id: '1',
      name: 'Dr. John Smith',
      subjects: ['Computer Science', 'Artificial Intelligence'],
      cabin: 'Room 101',
      email: 'john.smith@college.edu',
      phone: '123-456-7890',
    },
    {
      id: '2',
      name: 'Prof. Sarah Johnson',
      subjects: ['Mathematics', 'Statistics'],
      cabin: 'Room 202',
      email: 'sarah.johnson@college.edu',
      phone: '123-456-7891',
    },
    {
      id: '3',
      name: 'Dr. Michael Brown',
      subjects: ['Physics', 'Quantum Mechanics'],
      cabin: 'Room 303',
      email: 'michael.brown@college.edu',
      phone: '123-456-7892',
    },
  ];

  const displayFaculty = faculty.length > 0 ? filteredFaculty : sampleFaculty;

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredFaculty(faculty);
      setSuggestions([]);
      return;
    }

    // Filter faculty based on search query
    const filtered = faculty.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(text.toLowerCase());
      const subjectMatch = item.subjects.some(subject => 
        subject.toLowerCase().includes(text.toLowerCase())
      );
      const cabinMatch = item.cabin.toLowerCase().includes(text.toLowerCase());
      
      return nameMatch || subjectMatch || cabinMatch;
    });
    
    setFilteredFaculty(filtered);

    // Generate search suggestions
    if (text.length > 2) {
      generateSuggestions(text);
    } else {
      setSuggestions([]);
    }
  };

  const generateSuggestions = async (query: string) => {
    setSuggestionsLoading(true);
    try {
      const suggestionsData = await generateSearchSuggestions(query, { faculty });
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
    setSuggestions([]);
  };

  const renderFacultyItem = ({ item }: { item: Faculty }) => (
    <View style={styles.facultyCard}>
      <Text style={styles.facultyName}>{item.name}</Text>
      <Text style={styles.facultySubjects}>
        Subjects: {item.subjects.join(', ')}
      </Text>
      <Text style={styles.facultyCabin}>Cabin: {item.cabin}</Text>
      {item.email && <Text style={styles.facultyContact}>Email: {item.email}</Text>}
      {item.phone && <Text style={styles.facultyContact}>Phone: {item.phone}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Faculty</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, subject, or location..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => handleSearch('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {suggestionsLoading && (
          <View style={styles.suggestionsLoadingContainer}>
            <ActivityIndicator size="small" color="#4F46E5" />
          </View>
        )}

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Ionicons name="search-outline" size={16} color="#666" />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading faculty data...</Text>
        </View>
      ) : (
        <FlatList
          data={displayFaculty}
          renderItem={renderFacultyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No faculty found matching your search.</Text>
            </View>
          }
        />
      )}
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
  searchContainer: {
    padding: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  suggestionsLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  facultyCard: {
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
  facultyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  facultySubjects: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  facultyCabin: {
    fontSize: 14,
    color: '#4F46E5',
    marginBottom: 5,
  },
  facultyContact: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default SearchScreen; 