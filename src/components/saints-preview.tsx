import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@radix-ui/react-label";

export type SaintsPreviewProps = {
  saints: {
    name: string;
    image: string;
    slug: string;
  }[];
  onValueChange?: (value: string) => void;
};

export function SaintsPreview({ saints, onValueChange }: SaintsPreviewProps) {
  return (
    <RadioGroup
      defaultValue="sao-jose"
      className="w-full max-w-xl mx-auto"
      onValueChange={onValueChange}
    >
      <Carousel className="w-full max-w-lg mx-auto">
        <CarouselContent>
          {saints.map((saint, index) => (
            <CarouselItem key={index} className="basis-1/3 flex">
              <div className="p-1">
                <RadioGroupItem
                  value={saint.slug}
                  id={saint.slug}
                  className="peer sr-only"
                  aria-label={saint.name}
                />
                <Label
                  htmlFor={saint.slug}
                  className="flex flex-col text-center items-center justify-between rounded-md border-2 border-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <p className="px-2 text-primary text-sm py-2 font-semibold">{saint.name}</p>
                </Label>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious type="button"/>
        <CarouselNext type="button"/>
      </Carousel>
    </RadioGroup>
  );
}