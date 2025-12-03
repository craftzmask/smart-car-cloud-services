import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { AiModel } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { useNavigate, useParams } from "react-router";
import { CloudLayout } from "../components/CloudLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine, Check, FolderClosed, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/shared/UploadFile";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { capitalize } from "@/utils";

interface UploadItem {
  filename: string;
  isAlreadyClicked: boolean;
  isRight: boolean;
  predictions: number;
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

function getSimulatedPrediction(): {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
} {
  const keys = [
    "alert_sounds",
    "emergency_sirens",
    "environmental_sounds",
    "road_traffic",
    "collision_sounds",
    "human_scream",
  ];

  // CONFIGURATION
  // 20 = Very confident model (winner gets ~90%)
  // 5  = Less confident model (winner gets ~50-60%)
  const biasStrength = 20;

  // 1. Pick a random "winner" index
  const dominantIndex = Math.floor(Math.random() * keys.length);

  // 2. Generate weights (Winner gets Random + Bias, others get just Random)
  const weights = keys.map((_, index) =>
    index === dominantIndex ? Math.random() + biasStrength : Math.random()
  );

  // 3. Calculate Total Weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // 4. Normalize to 100% and find the highest
  const probabilities: Record<string, number> = {};
  let highestType = "";
  let highestValue = -1;

  keys.forEach((key, index) => {
    const probability = (weights[index] / totalWeight) * 100;
    probabilities[key] = probability;

    if (probability > highestValue) {
      highestValue = probability;
      highestType = key;
    }
  });

  return {
    probabilities,
    prediction: highestType,
    confidence: highestValue,
  };
}

export function CloudModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);

  const navigate = useNavigate();
  const ownerId = "u-owner-1";

  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  const selectedItem =
    selectedFilename != null
      ? items.find((i) => i.filename === selectedFilename) ?? null
      : null;

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const model = data.aiModels.find((m: AiModel) => m.id === modelId) as
    | AiModel
    | undefined;

  if (!model) {
    return (
      <CloudLayout>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeftFromLine />
            Back to models
          </Button>
          <div className="mt-2 text-slate-500">Model not found.</div>
        </div>
      </CloudLayout>
    );
  }

  function handleUpload(files: File[]) {
    // Generate a STABLE prediction for each new file when it is uploaded
    const newItems: UploadItem[] = files.map((file) => {
      const { prediction, confidence, probabilities } =
        getSimulatedPrediction();

      return {
        filename: file.name,
        isAlreadyClicked: false,
        isRight: false,
        predictions: confidence, // reuse confidence for "Predicted: xx%"
        prediction,
        confidence,
        probabilities,
      };
    });

    setItems((prev) => [...newItems]);

    // Optionally auto-select the first newly uploaded file
    if (files.length > 0) {
      setSelectedFilename(files[0].name);
    }
  }

  function handleItemClicked(item: UploadItem) {
    setSelectedFilename(item.filename);
  }

  function handleRightWrongClicked(updated: UploadItem) {
    setItems((prev) =>
      prev.map((item) => (item.filename === updated.filename ? updated : item))
    );

    // keep selected pointing to same filename (no need to update selectedFilename)
  }

  return (
    <CloudLayout>
      <div className="space-y-6 p-6">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{model.name}</span>{" "}
              <Badge
                className={
                  model.status === "RUNNING"
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                    : model.status === "TRAINING"
                    ? "text-amber-600 bg-amber-50 border-amber-200"
                    : "text-slate-500 bg-slate-50 border-slate-200"
                }
              >
                {model.status}
              </Badge>
            </CardTitle>
            <CardDescription>{model.type}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FileUpload onUpload={handleUpload} />
              <Result item={selectedItem} />
            </div>
            <HistoryUploadedFiles
              items={items}
              selectedItem={selectedItem}
              onClick={handleItemClicked}
              onRightWrongClick={handleRightWrongClicked}
            />
          </CardContent>
        </Card>
      </div>
    </CloudLayout>
  );
}

interface HistoryUploadedFilesProps {
  items: UploadItem[];
  selectedItem: UploadItem | null;
  onClick: (item: UploadItem) => void;
  onRightWrongClick: (item: UploadItem) => void;
}

function HistoryUploadedFiles({
  items,
  selectedItem,
  onClick,
  onRightWrongClick,
}: HistoryUploadedFilesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>Track predictions and your judgement</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            No files has been uploaded yet.
          </div>
        ) : (
          items.map((item) => (
            <Item
              className={`hover:cursor-pointer ${
                selectedItem?.filename === item.filename
                  ? `${
                      !item.isAlreadyClicked || item.isRight
                        ? "border-green-600"
                        : "border-rose-600"
                    }`
                  : ""
              }`}
              key={item.filename}
              variant="outline"
              onClick={() => onClick(item)}
            >
              <ItemContent>
                <ItemTitle>{item.filename}</ItemTitle>
                <ItemDescription>
                  Predicted: {item.predictions.toFixed(1)}%
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {item.isAlreadyClicked ? (
                  item.isRight ? (
                    <Check className="text-green-600" />
                  ) : (
                    <X className="text-rose-600" />
                  )
                ) : null}

                {selectedItem?.filename === item.filename &&
                  !item.isAlreadyClicked && (
                    <>
                      <Button
                        disabled={item.isAlreadyClicked}
                        onClick={() =>
                          onRightWrongClick({
                            ...item,
                            isAlreadyClicked: true,
                            isRight: true,
                          })
                        }
                      >
                        Right
                      </Button>
                      <Button
                        className="border border-rose-500 text-rose-500"
                        disabled={item.isAlreadyClicked}
                        variant="outline"
                        onClick={() =>
                          onRightWrongClick({
                            ...item,
                            isAlreadyClicked: true,
                            isRight: false,
                          })
                        }
                      >
                        Wrong
                      </Button>
                    </>
                  )}
              </ItemActions>
            </Item>
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface ResultProps {
  item: UploadItem | null;
}

function Result({ item }: ResultProps) {
  if (item === null) {
    return (
      <Empty className="border border-solid">
        <EmptyHeader className="flex flex-col">
          <EmptyMedia variant="icon">
            <FolderClosed />
          </EmptyMedia>
          <EmptyTitle>Result is not found</EmptyTitle>
          <EmptyDescription>
            Please select uploaded file from history
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.filename}</CardTitle>
        <CardDescription>Audio Classification Result</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Item variant="outline" className="border border-green-500 bg-green-50">
          <ItemContent className="flex flex-col justify-center items-center">
            <ItemTitle className="text-2xl">
              {capitalize(item.prediction)}
            </ItemTitle>
            <ItemDescription className="text-lg text-green-500">
              {item.confidence.toFixed(1)}% Confidence
            </ItemDescription>
          </ItemContent>
        </Item>
        <div className="flex flex-col gap-2">
          {Object.keys(item.probabilities).map((key) => (
            <Item variant="outline" key={key}>
              <ItemContent>
                <ItemTitle className="w-full flex items-center">
                  <span className="flex-2">{capitalize(key)}</span>
                  <Progress
                    // Progress expects a number, not string
                    value={item.probabilities[key]}
                    className="flex-4"
                  />
                  <span className="flex-1 text-right">
                    {item.probabilities[key].toFixed(1)}%
                  </span>
                </ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
