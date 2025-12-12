import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { AiModel } from "@/domain/types";
import { judgeAiResult, predictWithAiModel } from "../api/aiModelsApi";
import { useCloudDashboard } from "@/features/cloud/hooks/useCloudDashboard";
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
import { useEffect, useState } from "react";
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
  createdAt?: string;
  isAlreadyClicked: boolean;
  isRight: boolean;
  predictions: number;
  result: Record<string, number>;
}

export function CloudModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<UploadItem | null>(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useCloudDashboard();

  // hydrate history from backend results
  useEffect(() => {
    if (!data || !modelId) return;
    const model = data.aiModels.find((m: AiModel) => m.id === modelId);
    if (!model || !Array.isArray(model.results) || model.results.length === 0)
      return;

    const mapped: UploadItem[] = model.results.map((r: any) => {
      const probs = (r?.probabilities as Record<string, number>) || {};
      const prediction =
        r?.predictedClass ||
        Object.keys(probs)[0] ||
        "";
      const confidenceRaw =
        typeof r?.confidence === "number"
          ? r.confidence
          : probs[prediction] ?? 0;
      const confidence = confidenceRaw * 100;
      const percentProbs = Object.fromEntries(
        Object.entries(probs).map(([k, v]) => [k, v * 100])
      );

      return {
        filename: r?.filename || r?.name || "Prediction",
        createdAt: r?.createdAt,
        isAlreadyClicked: typeof r?.isCorrect === "boolean",
        isRight: typeof r?.isCorrect === "boolean" ? r.isCorrect : true,
        predictions: confidence,
        result: percentProbs,
      };
    });

    setItems(mapped);
    setSelectedItem(mapped[0] || null);
  }, [data, modelId]);

  useEffect(() => {
    if (!modelId || files.length === 0) return;
    // sequentially upload each file and store result
    (async () => {
      for (const file of files) {
        try {
          const result = await predictWithAiModel(modelId, file);
          const probabilities =
            (result?.probabilities as Record<string, number>) || {};
          const prediction =
            result?.predictedClass ||
            Object.keys(probabilities)[0] ||
            "";
          const confidence =
            typeof result?.confidence === "number"
              ? result.confidence * 100
              : (probabilities[prediction] ?? 0) * 100;
          const percentProbs = Object.fromEntries(
            Object.entries(probabilities).map(([k, v]) => [k, v * 100])
          );

          const newItem: UploadItem = {
            filename: file.name,
            createdAt: result?.createdAt,
            isAlreadyClicked: false,
            predictions: Number(confidence),
            isRight: false,
            result: percentProbs,
          };
          setItems((prev) => [newItem, ...prev]);
          setSelectedItem(newItem);
        } catch (err) {
          console.error("Prediction failed", err);
        }
      }
    })();
  }, [files, modelId]);

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
    setFiles(files);
  }

  // const items: UploadItem[] = files.map((file) => ({
  //   filename: file.name,
  //   isAlreadyClicked: false,
  //   predictions: Math.random() * 100,
  //   result: {
  //     alert_sounds: Math.random() * 100,
  //     emergency_sirens: Math.random() * 100,
  //     environmental_sounds: Math.random() * 100,
  //     road_traffic: Math.random() * 100,
  //     collision_sounds: Math.random() * 100,
  //     human_scream: Math.random() * 100,
  //   },
  // }));

  function handleItemClicked(item: UploadItem) {
    setSelectedItem(item);
  }

  async function handleRightWrongClicked(updated: UploadItem) {
    try {
      if (modelId) {
        await judgeAiResult({
          modelId,
          filename: updated.filename,
          createdAt: updated.createdAt,
          isCorrect: updated.isRight,
        });
      }
      setItems(
        items.map((item) =>
          item.filename === updated.filename ? updated : item
        )
      );
    } catch (err) {
      console.error("Failed to persist judgement", err);
    }
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

                {selectedItem?.filename == item.filename &&
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

  const probEntries = Object.entries(item.result as Record<string, number>);
  const prediction =
    probEntries.sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  const confidence = item.predictions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item?.filename}</CardTitle>
        <CardDescription>Audio Classification Result</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Item variant="outline" className="border border-green-500 bg-green-50">
          <ItemContent className="flex flex-col justify-center items-center">
            <ItemTitle className="text-2xl">
              {capitalize(prediction)}
            </ItemTitle>
            <ItemDescription className="text-lg text-green-500">
              {confidence.toFixed(1)}% Confidence
            </ItemDescription>
          </ItemContent>
        </Item>
        <div className="flex flex-col gap-2">
          {probEntries.map(([key, value]) => (
            <Item variant="outline" key={key}>
              <ItemContent>
                <ItemTitle className="w-full flex items-center">
                  <span className="flex-2">{capitalize(key)}</span>
                  <Progress value={value} className="flex-4" />
                  <span className="flex-1 text-right">
                    {value.toFixed(1)}%
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
