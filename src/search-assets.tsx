import { ActionPanel, Action, Icon, Grid, showToast, Toast, Clipboard } from "@raycast/api";
import { useState, useEffect } from "react";

// Интерфейс для элементов библиотеки
interface AssetItem {
  id: string;
  name: string;
  tags: string[];
  category: string;
  filename: string;
  url: string;
  size: string;
}

// Интерфейс для metadata.json
interface AssetLibrary {
  name: string;
  version: string;
  updated: string;
  assets: AssetItem[];
}

export default function Command() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL твоего GitHub репозитория
  const METADATA_URL = "https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/main/metadata.json";

  // Загружаем данные из GitHub
  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await fetch(METADATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as AssetLibrary;
        setAssets(data.assets);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching assets:", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Error loading assets",
          message: "Check your internet connection and repository URL"
        });
        setIsLoading(false);
      }
    }

    fetchAssets();
  }, []);

  // Функция для копирования URL изображения
  async function copyImageUrl(asset: AssetItem) {
    try {
      await Clipboard.copy(asset.url);
      showToast({
        style: Toast.Style.Success,
        title: "URL copied!",
        message: `${asset.name} URL is in clipboard`
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Copy failed",
        message: "Could not copy URL"
      });
    }
  }

  // Группируем assets по категориям
  const groupedAssets = assets.reduce((groups, asset) => {
    const category = asset.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(asset);
    return groups;
  }, {} as Record<string, AssetItem[]>);

  return (
    <Grid isLoading={isLoading} searchBarPlaceholder="Search team graphics..." columns={6}>
      {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
        <Grid.Section key={category} title={category.charAt(0).toUpperCase() + category.slice(1)}>
          {categoryAssets.map((asset) => (
            <Grid.Item
              key={asset.id}
              content={{ source: asset.url }}
              title={asset.name}
              subtitle={asset.size}
              actions={
                <ActionPanel>
                  <Action.OpenInBrowser
                    title="Open & Copy Image"
                    url={asset.url}
                    icon={Icon.Globe}
                  />
                  <Action
                    title="Copy Image URL"
                    icon={Icon.Clipboard}
                    onAction={() => copyImageUrl(asset)}
                    shortcut={{ modifiers: ["cmd"], key: "c" }}
                  />
                </ActionPanel>
              }
            />
          ))}
        </Grid.Section>
      ))}
    </Grid>
  );
}