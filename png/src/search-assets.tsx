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

  // Category information with emojis and descriptions
  const categoryInfo: Record<string, { emoji: string; title: string; description: string; icon: Icon }> = {
    "diagrams": { emoji: "📊", title: "Diagrams", description: "Charts, flowcharts, and data visualizations", icon: Icon.BarChart },
    "ebees": { emoji: "🐝", title: "eBees", description: "All versions of eBee mascot", icon: Icon.Bug },
    "icons": { emoji: "❤️", title: "Icons", description: "UI icons and symbols", icon: Icon.AppWindowGrid3x3 },
    "illustrations": { emoji: "🎨", title: "Illustrations", description: "Custom illustrations and artwork", icon: Icon.Image },
    "logos": { emoji: "🍏", title: "Logos", description: "Brand logos and marks", icon: Icon.Building },
    "stickers": { emoji: "📌", title: "Stickers", description: "Fun stickers and decorative elements", icon: Icon.Star },
    "templates": { emoji: "📄", title: "Templates", description: "Design templates and layouts", icon: Icon.Document }
  };

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
    return categoryInfo[category.toLowerCase()]?.icon || Icon.Folder;
  }

  function getCategoryDisplayName(category: string): string {
    const info = categoryInfo[category.toLowerCase()];
    return info ? info.title : category.charAt(0).toUpperCase() + category.slice(1);
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
              .sort(([a], [b]) => {
                // Сортируем по порядку из categoryInfo, затем алфавитно
                const orderA = Object.keys(categoryInfo).indexOf(a.toLowerCase());
                const orderB = Object.keys(categoryInfo).indexOf(b.toLowerCase());
                
                if (orderA !== -1 && orderB !== -1) {
                  return orderA - orderB;
                } else if (orderA !== -1) {
                  return -1;
                } else if (orderB !== -1) {
                  return 1;
                } else {
                  return a.localeCompare(b);
                }
              })
              .map(([category, count]) => {
                const info = categoryInfo[category.toLowerCase()];
                return (
                  <Grid.Dropdown.Item
                    key={category}
                    title={`${info ? info.title : category.charAt(0).toUpperCase() + category.slice(1)} (${count})`}
                    value={category}
                    icon={getCategoryIcon(category)}
                  />
                );
              })
            }
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      {Object.entries(groupedAssets)
        .sort(([a], [b]) => {
          // Применяем тот же порядок сортировки для секций
          const orderA = Object.keys(categoryInfo).indexOf(a.toLowerCase());
          const orderB = Object.keys(categoryInfo).indexOf(b.toLowerCase());
          
          if (orderA !== -1 && orderB !== -1) {
            return orderA - orderB;
          } else if (orderA !== -1) {
            return -1;
          } else if (orderB !== -1) {
            return 1;
          } else {
            return a.localeCompare(b);
          }
        })
        .map(([category, categoryAssets]) => (
          <Grid.Section key={category} title={getCategoryDisplayName(category)}>
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