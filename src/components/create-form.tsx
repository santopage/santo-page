"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { SaintsPreview } from "@/components/saints-preview";
import saints from '@/saints.json';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { createPage } from "@/app/api/create-page";
import { createCheckoutSession } from "@/lib/stripe";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react"; // Ícone do Lucide para o botão

export function CreatePageForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { handleSubmit, control, setValue } = useForm();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedSaint, setSelectedSaint] = useState<string>("sao-jose");

  const onSubmit = async (formData: FieldValues) => {
    const files = formData.images;
    if (!files || files.length === 0) {
      return;
    }

    try {
      const uploadPromises = Array.from(files as FileList).map(async (file: File) => {
        const fileName = `${Date.now()}-${file.name}`;
      
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, fileType: file.type }),
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get signed URL");
        }
      
        const { url } = await response.json();
      
        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
      
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(errorText || "Upload failed");
        }
      
        return `${process.env.NEXT_PUBLIC_ASSETS_URL}/${fileName}`;
      });

      const images = await Promise.all(uploadPromises);

      const { id: page_id } = await createPage({ saint_slug: selectedSaint, images });
      const checkoutUrl = await createCheckoutSession(1, page_id);
      router.push(`${checkoutUrl}`);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: FileList | null) => void
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      fieldChange(files);
      setImagePreviews(Array.from(files).map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSaintChange = (value: string) => {
    setSelectedSaint(value);
    setValue("saint", value);
  };

  return (
    <div className={cn("flex flex-col gap-6 bg-gradient-to-b from-gray-50 to-white", className)} {...props}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Criar página</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Preencha os campos abaixo para criar sua página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-8">
              <div className="grid gap-4 flex justify-center">
                {saints.length > 0 && (
                  <SaintsPreview
                    saints={saints}
                    onValueChange={handleSaintChange}
                  />
                )}
              </div>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <Label htmlFor="images" className="text-lg text-gray-700">Imagens da sua família</Label>
                </div>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, field.onChange)}
                      className="border-2 border-gray-200 rounded-lg p-2"
                    />
                  )}
                />
              </div>
              {imagePreviews.length > 0 && (
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {imagePreviews.map((src, index) => (
                      <CarouselItem key={index} className="basis-1/2">
                        <div className="">
                          <Card className="shadow-md">
                            <CardContent className="flex items-center p-0 justify-center">
                              <img
                                src={src}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious type="button" className="bg-white shadow-md"/>
                  <CarouselNext type="button" className="bg-white shadow-md"/>
                </Carousel>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg"
                onClick={handleSubmit(onSubmit)}
              >
                Próximo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}