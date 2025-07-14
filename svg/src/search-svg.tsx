import { ActionPanel, Action, Icon, Grid, showToast, Toast, Clipboard } from "@raycast/api";
import { useState, useEffect } from "react";

// Interface for SVG library elements
interface SvgAssetItem {
  id: string;
  name: string;
  tags?: string[];
  category: string;
  url: string;
  svgUrl: string;
  size?: string;
  lastUpdated?: string;
}

// Interface for metadata.json
interface SvgAssetLibrary {
  name: string;
  version: string;
  updated: string;
  totalAssets: number;
  categories: string[];
  assets: SvgAssetItem[];
}

export default function Command() {
  const [assets, setAssets] = useState<SvgAssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // GitHub repo URL for metadata
  const METADATA_URL = "https://raw.githubusercontent.com/vadim-ux/team-graphics-library-official/main/metadata.json";

  // Loading SVG assets from GitHub
  useEffect(() => {
    async function fetchSvgAssets() {
      try {
        const response = await fetch(METADATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as SvgAssetLibrary;
        
        // Filter only assets that have SVG versions
        const svgAssets = data.assets.filter(asset => asset.hasSvg && asset.svgUrl);
        setAssets(svgAssets);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching SVG assets:", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Error loading SVG assets",
          message: "Check your internet connection and repository URL"
        });
        setIsLoading(false);
      }
    }
    fetchSvgAssets();
  }, []);

  // Function to fetch and copy SVG content
  async function copySvgContent(asset: SvgAssetItem) {
    try {
      showToast({
        style: Toast.Style.Animated,
        title: "Fetching SVG...",
        message: asset.name
      });

      const response = await fetch(asset.svgUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status}`);
      }

      const svgContent = await response.text();
      await Clipboard.copy(svgContent);
      
      showToast({
        style: Toast.Style.Success,
        title: "SVG copied!",
        message: `${asset.name} SVG code is in clipboard`
      });
    } catch (error) {
      console.error("Error copying SVG:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Copy failed",
        message: "Could not fetch or copy SVG content"
      });
    }
  }

  // Function to copy SVG URL
  async function copySvgUrl(asset: SvgAssetItem) {
    try {
      await Clipboard.copy(asset.svgUrl);
      showToast({
        style: Toast.Style.Success,
        title: "URL copied!",
        message: `${asset.name} SVG URL is in clipboard`
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Copy failed",
        message: "Could not copy URL"
      });
    }
  }

  // Category information with icons
  const categoryInfo: Record<string, { title: string; icon: Icon }> = {
    "diagrams": { title: "Diagrams", icon: Icon.BarChart },
    "ebees": { title: "eBees", icon: Icon.Bug },
    "icons": { title: "Icons", icon: Icon.AppWindowGrid3x3 },
    "illustrations": { title: "Illustrations", icon: Icon.Image },
    "logos": { title: "Logos", icon: Icon.Building },
    "stickers": { title: "Stickers", icon: Icon.Star },
    "templates": { title: "Templates", icon: Icon.Document }
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
  }, {} as Record<string, SvgAssetItem[]>);

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
      searchBarPlaceholder="Search SVG assets..." 
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
              title={`All SVG Assets (${assets.length})`} 
              value="all" 
              icon={Icon.Document}
            />
            {Object.entries(categories)
              .sort(([a], [b]) => {
                // Sort by category order from categoryInfo, then alphabetically
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
          // Apply same sorting logic for sections
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
                content={{ source: asset.url }} // Show PNG preview as thumbnail
                title={asset.name}
                subtitle={asset.size || 'SVG'}
                actions={
                  <ActionPanel>
                    <Action
                      title="Copy SVG Code"
                      icon={Icon.Clipboard}
                      onAction={() => copySvgContent(asset)}
                    />
                    <Action
                      title="Copy SVG URL"
                      icon={Icon.Link}
                      onAction={() => copySvgUrl(asset)}
                      shortcut={{ modifiers: ["cmd"], key: "u" }}
                    />
                    <Action.OpenInBrowser
                      title="Open SVG in Browser"
                      url={asset.svgUrl}
                      shortcut={{ modifiers: ["cmd"], key: "o" }}
                    />
                    <Action.OpenInBrowser
                      title="Open PNG in Browser"
                      url={asset.url}
                      shortcut={{ modifiers: ["cmd"], key: "p" }}
                    />
                    <ActionPanel.Section>
                      <Action.CopyToClipboard
                        title="Copy Asset ID"
                        content={asset.id}
                        shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                      />
                    </ActionPanel.Section>
                  </ActionPanel>
                }
              />
            ))}
          </Grid.Section>
        ))}
    </Grid>
  );
}