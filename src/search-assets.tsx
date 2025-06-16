import { ActionPanel, Action, Icon, Grid, showToast, Toast, Clipboard } from "@raycast/api";
import { useState, useEffect } from "react";

// Interface for library elements
interface AssetItem {
  id: string;
  name: string;
  tags: string[];
  category: string;
  filename: string;
  url: string;
  size: string;
}

// Interface for metadata.json
interface AssetLibrary {
  name: string;
  version: string;
  updated: string;
  assets: AssetItem[];
}

export default function Command() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // GH repo URL
  const METADATA_URL = "https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/main/metadata.json";

  // Loading data from GH
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

  // Function to copy image URL
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

  // Get unique categories with counts
  const categories = assets.reduce((acc, asset) => {
    const category = asset.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter assets by selected category
  const filteredAssets = selectedCategory === "all" 
    ? assets 
    : assets.filter(asset => asset.category === selectedCategory);

  // Group filtered assets by category
  const groupedAssets = filteredAssets.reduce((groups, asset) => {
    const category = asset.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(asset);
    return groups;
  }, {} as Record<string, AssetItem[]>);

  function getCategoryIcon(category: string): Icon {
    switch (category.toLowerCase()) {
      case "logos":
        return Icon.Building;
      case "icons":
        return Icon.AppWindowGrid3x3;
      case "illustrations":
        return Icon.Image;
      case "photos":
        return Icon.Camera;
      case "graphics":
        return Icon.Palette;
      default:
        return Icon.Folder;
    }
  }

  return (
    <Grid 
      isLoading={isLoading} 
      searchBarPlaceholder="Search team graphics..." 
      columns={8}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Select Category"
          storeValue={true}
          onChange={(newValue) => setSelectedCategory(newValue)}
        >
          <Grid.Dropdown.Section title="Categories">
            <Grid.Dropdown.Item 
              key="all" 
              title={`All Assets (${assets.length})`} 
              value="all" 
              icon={Icon.Grid3x3}
            />
            {Object.entries(categories)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, count]) => (
                <Grid.Dropdown.Item
                  key={category}
                  title={`${category.charAt(0).toUpperCase() + category.slice(1)} (${count})`}
                  value={category}
                  icon={getCategoryIcon(category)}
                />
              ))
            }
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
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
