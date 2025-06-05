import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Users, BarChart3, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        title="Investment Office Dashboard" 
        description="Manage your clients and their financial assets"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Client Management</CardTitle>
            <Users className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Create, view, and manage client information and status.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link href="/clients" className="w-full">
              <Button className="w-full group">
                Manage Clients
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Asset Management</CardTitle>
            <BarChart3 className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Track and manage financial assets and their current values.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link href="/assets" className="w-full">
              <Button className="w-full group">
                Manage Assets
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Allocations</CardTitle>
            <DollarSign className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              View and manage asset allocations for each client.
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link href="/allocations" className="w-full">
              <Button className="w-full group">
                View Allocations
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}