// Mock Expo's winter runtime
global.__ExpoImportMetaRegistry = {
    get: jest.fn(() => ({})),
};

// Mock structuredClone if it doesn't exist
if (!global.structuredClone) {
    global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    })),
    useLocalSearchParams: jest.fn(() => ({})),
    router: {
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    },
    Stack: {
        Screen: 'Screen',
    },
}));

// Mock expo-image
jest.mock('expo-image', () => ({
    Image: 'Image',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));
