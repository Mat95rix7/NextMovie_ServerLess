import { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart, Clock, Star, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useMovieInteractions } from '@/hooks/useMovieInteractions';
import { cn } from '@/lib/utils';

function MovieActions({ userId, movieId }) {
  const {
    isFavorite,
    isWatchLater,
    rating,
    isLoading,
    toggleFavorite,
    toggleWatchLater,
    updateRating
  } = useMovieInteractions(userId, movieId);

  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <div className="animate-pulse h-8 w-8 bg-white/30 rounded-full" />;
  }

  return (
    <div className="absolute top-2 right-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen} >
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 rounded-full bg-white/30 hover:bg-white/50"
          >
            <MoreHorizontal className="h-4 w-4 text-black" />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 rounded-xl bg-gray-100 text-amber-700 border-none"
        >
          <DropdownMenuItem 
            className="font-bold rounded-xl cursor-pointer"
            onClick={toggleFavorite}
          >
            <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-current")} />
            <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="font-bold rounded-xl cursor-pointer"
            onClick={toggleWatchLater}
          >
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {isWatchLater ? 'Retirer de la liste' : 'Voir plus tard'}
            </span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="font-bold rounded-xl">
              <Star className="h-4 w-4 mr-2" />
              <span>
                {rating ? `Votre note: ${rating}★` : 'Noter le film'}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-gray-900 rounded-xl">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <DropdownMenuItem
                    key={stars}
                    className={cn(
                      "font-bold cursor-pointer",
                      rating === stars && "bg-amber-200"
                    )}
                    onClick={() => updateRating(stars)}
                  >
                    {Array(stars).fill('★').join('')}
                  </DropdownMenuItem>
                ))}
                {rating && (
                  <DropdownMenuItem
                    className="font-bold text-red-500 cursor-pointer"
                    onClick={() => updateRating(0)}
                  >
                    Retirer la note
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

MovieActions.propTypes = {
  userId: PropTypes.string.isRequired,
  movieId: PropTypes.number.isRequired,
};

export default MovieActions;