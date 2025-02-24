'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { Check, Home, Package, Truck } from "lucide-react";

interface PageData {
  id: number;
  saint: {
    id: number;
    name: string;
    image_url: string;
    patron_of: string;
    prayers: {
      id: number;
      title: string;
      content: string;
    }[];
  };
  images: {
    id: number,
    page_id: number,
    image_url: string,
  }[],
  title: string;
  content: string;
  active: boolean;
}

export default function Page() {
  const params = useParams();
  const [currentStep, setCurrentStep] = useState(37);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const steps = [
    { label: "Pedido recebido", icon: <Package className="w-5 h-5" /> },
    { label: "Preparando", icon: <Check className="w-5 h-5" /> },
    { label: "Saiu para entrega", icon: <Truck className="w-5 h-5" /> },
    { label: "Entregue", icon: <Home className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const { id } = params;
    if (id) {
      const fetchPageData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${id}`);
          if (response.ok) {
            const data = await response.json();
            setPageData(data);
          } else {
            setError("Erro ao buscar dados da página");
          }
        } catch {
          setError("Erro ao fazer requisição para a API");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPageData();
    }
  }, [params]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive" className="w-1/2">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive" className="w-1/2">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>Nenhum dado encontrado.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-10 bg-gray-50">
      <div className="flex justify-center">
        <div className="w-1/2 flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  index <= currentStep ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                {step.icon}
              </div>
              <p className="text-sm mt-2">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center pb-6">
        <div className="w-1/2">
        <Progress value={currentStep} className="h-2" />
        </div>
      </div>
      <div
        className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg relative"
        style={{
          backgroundImage: `url(${pageData.saint.image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay Escuro para Melhorar Legibilidade */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Conteúdo do Card */}
        <Card className="relative bg-transparent border-none">
          <CardHeader className="text-center">
            <p className="text-xl text-gray-200">{pageData.saint.name}</p>
          </CardHeader>
          <CardContent className="space-y-6">


            {/* Informações do Santo */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 relative">
                <img
                  src={pageData.saint.image_url}
                  alt={pageData.saint.name}
                  fill
                  className="object-cover w-16 h-16 rounded-full"
                />
              </div>
              <div>
                <p className="text-lg font-medium text-white">{pageData.saint.name}</p>
                <p className="text-sm text-gray-200">Padroeiro de {pageData.saint.patron_of}</p>
              </div>
            </div>

            {/* Orações */}
            {pageData.active && (
              <div>
                <h2 className="text-xl font-semibold text-white">Orações</h2>
                <div className="mt-4 space-y-4">
                  {pageData.saint.prayers.map((prayer) => (
                    <Card key={prayer.id} className="bg-white bg-opacity-90">
                      <CardHeader>
                        <h3 className="text-lg font-medium">{prayer.title}</h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{prayer.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Oração do Dia */}
      <div className="w-full flex justify-center">
        <div className="w-1/2 px-5 py-2">
          <p className="text-lg font-medium">Oração do dia</p>
          <p className="text-sm text-gray-500">Lorem Ipsum dolor sit amet</p>
        </div>
      </div>
      {/* Carrossel de Imagens */}
      {pageData.images?.length > 0 && (
        <div className="w-full max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-semibold mb-4">Galeria de Imagens</h2>
          <Carousel>
            <CarouselContent>
              {pageData.images.map((image, index) => (
                <CarouselItem key={index} className="basis-full md:basis-1/2">
                  <div className="p-2">
                    <Card className="shadow-md">
                      <CardContent className="flex items-center p-0 justify-center">
                        <Image
                          width={800}
                          height={600}
                          src={image.image_url}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-48 md:h-64 object-cover rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious type="button" />
            <CarouselNext type="button" />
          </Carousel>
        </div>
      )}
    </div>
  );
}