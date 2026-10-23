import tee from "@/assets/tee-black.jpg";
import denim from "@/assets/denim-black.jpg";
import campaign from "@/assets/campaign-1.jpg";

export type ProductFilm = {
  id: string;
  title: string;
  poster: string;
  alt: string;
  videoSrc?: string;
};

// Add owner-supplied video URLs here; posters are previews, not playable films.
export const productFilms: ProductFilm[] = [
  { id: "signature", title: "The signature cut", poster: tee, alt: "Ciao Central black signature T-shirt" },
  { id: "denim", title: "Denim after dark", poster: denim, alt: "Black denim overshirt detail" },
  { id: "streets", title: "From our streets", poster: campaign, alt: "Ciao Central streetwear campaign in Nairobi" },
];