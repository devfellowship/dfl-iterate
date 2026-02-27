import { cn } from "@/lib/utils";
import { ChooseOption } from "@/types";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ChooseCardProps {
    choice: ChooseOption;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    disabled: boolean;
  }
  
  export function ChooseCard({ choice, index, isSelected, onSelect, disabled }: ChooseCardProps) {
    return (
      <motion.button
        onClick={onSelect}
        disabled={disabled}
        className={cn(
          "relative p-4 rounded-2xl border-2 flex flex-col items-center justify-start transition-all duration-200",
          "bg-card hover:bg-card/80",
          isSelected 
            ? "border-primary ring-4 ring-primary/20 shadow-lg" 
            : "border-border hover:border-primary/40"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
      >
        {/* Selection indicator */}
        {isSelected && (
          <motion.div 
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        )}
  
        <h3 className="font-display font-bold text-md text-left text-foreground mb-2 pr-8">
          {choice.description}
        </h3>
        
        {/* <p className="text-sm text-muted-foreground mb-4">
          {choice.description}
        </p> */}
      </motion.button>
    );
  }
  