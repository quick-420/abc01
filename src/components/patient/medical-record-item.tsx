import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2 } from "lucide-react";

interface MedicalRecord {
    id: string;
    title: string;
    date: string;
    doctor: string;
    type: string;
}

interface MedicalRecordItemProps {
  record: MedicalRecord;
}

export function MedicalRecordItem({ record }: MedicalRecordItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
            <div>
                <CardTitle className="text-lg font-headline">{record.title}</CardTitle>
                <CardDescription>Type: {record.type} | Date: {record.date}</CardDescription>
            </div>
            <FileText className="h-6 w-6 text-primary flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">Doctor: {record.doctor}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="mr-2 h-3 w-3" /> Download
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="mr-2 h-3 w-3" /> Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
