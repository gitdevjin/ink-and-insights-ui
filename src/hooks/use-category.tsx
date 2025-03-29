import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the category & subcategory types
interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

// Context value type
interface CategoryContextType {
  categories: Category[];
  fetchCategories: () => Promise<void>;
}

interface CategoryProviderProps {
  children: ReactNode;
}
// Create context
const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

// Provider component
export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categories"); // Adjust this to your API route
      const data = await response.json();
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

// Custom hook for using the context
export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}
