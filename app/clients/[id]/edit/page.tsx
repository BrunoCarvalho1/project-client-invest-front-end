"use client";

import { useAsset } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard-header";
import { AssetForm } from "@/components/assets/asset-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditAssetPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params?.id as string;
  
  const { data: asset, isLoading } = useAsset(assetId);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading asset...</p>
        </div>
      </div>
    );
  }
  
  if (!asset) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          Asset not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <Link href={`/assets/${asset.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <DashboardHeader
          title={`Edit Asset: ${asset.name}`}
          description="Update asset information"
        />
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Asset</CardTitle>
          <CardDescription>
            Make changes to the asset information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssetForm 
            asset={asset} 
            onSuccess={() => router.push(`/assets/${asset.id}`)} 
          />
        </CardContent>
      </Card>
    </div>
  );
}