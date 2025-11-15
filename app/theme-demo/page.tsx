/**
 * Demo page showcasing the Mediterranean Relief UI theme
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Heart, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-orange-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="default">
              Mediterranean Relief UI
            </Badge>
            <h1 className="mb-6 text-primary">
              Тема Cyprus Care
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Дизайн-система для координации помощи в кризисных ситуациях.
              Теплая, доверительная, доступная для всех возрастов.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Хочу помочь
              </Button>
              <Button size="lg" variant="secondary">
                <MapPin className="mr-2 h-5 w-5" />
                Посмотреть карту
              </Button>
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-5 w-5" />
                О платформе
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Color Palette Section */}
          <section>
            <h2 className="mb-6">Цветовая палитра</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-primary rounded-xl mb-4"></div>
                  <CardTitle>Deep Orange</CardTitle>
                  <CardDescription>
                    Огонь, срочность, кипрские закаты
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-secondary rounded-xl mb-4"></div>
                  <CardTitle>Safe Blue</CardTitle>
                  <CardDescription>
                    Доверие, спокойствие, вода
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-accent rounded-xl mb-4"></div>
                  <CardTitle>Olive Green</CardTitle>
                  <CardDescription>
                    Надежда, природа, восстановление
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-full h-24 bg-destructive rounded-xl mb-4"></div>
                  <CardTitle>Fire Red</CardTitle>
                  <CardDescription>
                    Ошибки, срочные оповещения
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Buttons Section */}
          <section>
            <h2 className="mb-6">Кнопки</h2>
            <Card>
              <CardHeader>
                <CardTitle>Варианты кнопок</CardTitle>
                <CardDescription>
                  Большие, удобные для нажатия, с четкой визуальной обратной связью
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="accent">Accent</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Forms Section */}
          <section>
            <h2 className="mb-6">Формы</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Регистрация волонтера</CardTitle>
                  <CardDescription>
                    Большие инпуты, четкие лейблы, удобные для пожилых людей
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя и фамилия</Label>
                    <Input id="name" placeholder="Введите ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" placeholder="+357" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">
                    Зарегистрироваться
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badges & Alerts</CardTitle>
                  <CardDescription>
                    Статусы и оповещения
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="accent">Success</Badge>
                    <Badge variant="destructive">Urgent</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  
                  <Alert variant="warning">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Внимание</AlertTitle>
                    <AlertDescription>
                      В регионе объявлена повышенная пожарная опасность
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="success">
                    <Heart className="h-5 w-5" />
                    <AlertTitle>Спасибо!</AlertTitle>
                    <AlertDescription>
                      Ваша заявка на участие принята
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Info Cards Section */}
          <section>
            <h2 className="mb-6">Карточки информации</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>250+ волонтеров</CardTitle>
                  <CardDescription>
                    Готовы помочь в любой момент
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>15 пунктов сбора</CardTitle>
                  <CardDescription>
                    По всему Кипру
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>1000+ помогли</CardTitle>
                  <CardDescription>
                    Людей получили поддержку
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <h2 className="mb-6">Типографика</h2>
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h1 className="text-primary">Heading 1 - Inter Font</h1>
                  <p className="text-muted-foreground">
                    Используется для главных заголовков
                  </p>
                </div>
                <div>
                  <h2>Heading 2 - Чистый и читаемый</h2>
                  <p className="text-muted-foreground">
                    Для заголовков секций
                  </p>
                </div>
                <div>
                  <h3>Heading 3 - Удобно для всех возрастов</h3>
                  <p className="text-muted-foreground">
                    Для подзаголовков
                  </p>
                </div>
                <div>
                  <p className="text-lg">
                    Параграф текста. Шрифт Inter обеспечивает отличную читаемость на всех устройствах.
                    Большой размер шрифта и увеличенный межстрочный интервал делают текст доступным
                    для пожилых людей.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Design Philosophy */}
          <section>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle>Философия дизайна</CardTitle>
                <CardDescription>
                  Mediterranean Relief UI - больше, чем просто тема
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-primary mb-2">🔥 Срочность</h3>
                    <p className="text-muted-foreground">
                      Оранжевый цвет символизирует огонь и необходимость действовать
                    </p>
                  </div>
                  <div>
                    <h3 className="text-secondary mb-2">💙 Доверие</h3>
                    <p className="text-muted-foreground">
                      Синий приносит спокойствие и уверенность в критических ситуациях
                    </p>
                  </div>
                  <div>
                    <h3 className="text-accent mb-2">🌿 Надежда</h3>
                    <p className="text-muted-foreground">
                      Зеленый символизирует природу, восстановление и будущее
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Navigation */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Навигация по проекту</CardTitle>
                <CardDescription>
                  Посмотрите тему в действии
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Heart className="mr-2 h-5 w-5" />
                      Главная страница
                    </Button>
                  </Link>
                  <Link href="/map">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <MapPin className="mr-2 h-5 w-5" />
                      Карта помощи
                    </Button>
                  </Link>
                  <Link href="/venues">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <MapPin className="mr-2 h-5 w-5" />
                      Пункты сбора
                    </Button>
                  </Link>
                  <Link href="/organizer">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Users className="mr-2 h-5 w-5" />
                      Организатор
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}

