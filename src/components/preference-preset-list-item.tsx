import React from 'react';
import { Shield, Heart, GraduationCap, ShoppingBag, Car, Leaf, Music, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { PreferencePreset } from "@/types/preference-preset";

export interface PreferencePresetListItemProps {
    preset: PreferencePreset;
    onClick?: () => void;
    onDelete?: () => void;
}

const preferenceConfig = [
    {
        key: 'preferenceSafety' as keyof PreferencePreset,
        label: 'An ninh',
        icon: Shield,
        color: 'bg-blue-100 text-blue-600',
    },
    {
        key: 'preferenceHealthcare' as keyof PreferencePreset,
        label: 'Y tế',
        icon: Heart,
        color: 'bg-red-100 text-red-600',
    },
    {
        key: 'preferenceEducation' as keyof PreferencePreset,
        label: 'Giáo dục',
        icon: GraduationCap,
        color: 'bg-purple-100 text-purple-600',
    },
    {
        key: 'preferenceShopping' as keyof PreferencePreset,
        label: 'Tiện ích',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-600',
    },
    {
        key: 'preferenceTransportation' as keyof PreferencePreset,
        label: 'Giao thông',
        icon: Car,
        color: 'bg-yellow-100 text-yellow-600',
    },
    {
        key: 'preferenceEnvironment' as keyof PreferencePreset,
        label: 'Môi trường',
        icon: Leaf,
        color: 'bg-teal-100 text-teal-600',
    },
    {
        key: 'preferenceEntertainment' as keyof PreferencePreset,
        label: 'Giải trí',
        icon: Music,
        color: 'bg-pink-100 text-pink-600',
    },
];

export const PreferencePresetListItem: React.FC<PreferencePresetListItemProps> = ({
                                                                                      preset,
                                                                                      onClick,
                                                                                      onDelete,
                                                                                  }) => {
    const handleClick = () => {
        onClick?.();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200">
            {/* Main Content Wrapper */}
            <div
                onClick={handleClick}
                className={cn(
                    "flex flex-1 gap-4 min-w-0",
                    onClick && "cursor-pointer"
                )}
            >
                {/* Image - Left side */}
                <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                        <img
                            src={preset.image}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content - Right side */}
                <div className="flex flex-col flex-1 min-w-0 gap-2">
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-900">
                        {preset.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {preset.description}
                    </p>

                    {/* Preferences Grid */}
                    <div className="flex flex-wrap gap-3 mt-1">
                        {preferenceConfig.map((config) => {
                            const value = preset[config.key] as number;
                            const Icon = config.icon;

                            return (
                                <div
                                    key={config.key}
                                    className="flex items-center gap-1.5"
                                    title={`${config.label}: ${value}%`}
                                >
                                    <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", config.color)}>
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">
                                        {value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Delete Button */}
            {onDelete && (
                <div className="flex gap-2 flex-shrink-0 lg:items-center lg:justify-center">
                    <Button
                        onClick={handleDelete}
                        variant="destructive"
                        size="sm"
                        className="flex-1 lg:flex-none cursor-pointer hover:bg-red-700"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                    </Button>
                </div>
            )}
        </div>
    );
};

