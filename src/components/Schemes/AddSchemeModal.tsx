import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save, Calendar, Users, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Scheme } from '@/types';

interface AddSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScheme: (scheme: Scheme) => void;
}

const schemeCategories = [
  'Housing & Infrastructure',
  'Education & Skill Development',
  'Healthcare & Welfare',
  'Agriculture & Rural Development',
  'Employment & Entrepreneurship',
  'Digital India & Technology',
  'Women & Child Development',
  'Senior Citizens & Elderly',
  'Environment & Sustainability',
  'Financial Inclusion'
];

const targetBeneficiaries = [
  'Below Poverty Line (BPL)',
  'Economically Weaker Section (EWS)',
  'Lower Income Group (LIG)',
  'Middle Income Group (MIG)',
  'Women',
  'Senior Citizens',
  'Youth (18-35 years)',
  'Farmers',
  'Small Business Owners',
  'Students',
  'Differently Abled',
  'All Citizens'
];

export function AddSchemeModal({ isOpen, onClose, onAddScheme }: AddSchemeModalProps) {
  const [formData, setFormData] = useState({
    schemeName: '',
    schemeCode: '',
    category: '',
    description: '',
    objectives: '',
    eligibilityCriteria: '',
    targetBeneficiaries: '',
    budgetAllocation: '',
    maxIncomeLimit: '',
    ageLimit: '',
    launchDate: '',
    applicationDeadline: '',
    implementingDepartment: '',
    contactDetails: '',
    requiredDocuments: '',
    benefits: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSchemeCode = (schemeName: string) => {
    const words = schemeName.split(' ');
    const code = words.map(word => word.charAt(0).toUpperCase()).join('') + 
                 new Date().getFullYear().toString().slice(-2) + 
                 Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.schemeName || !formData.category || !formData.description || !formData.targetBeneficiaries) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Generate scheme code if not provided
      const schemeCode = formData.schemeCode || generateSchemeCode(formData.schemeName);

      // Create a mock scheme entry (in real app, this would be sent to backend)
      const newScheme: Scheme = {
        id: Date.now().toString(),
        name: formData.schemeName,
        applicantName: 'System Generated', // This will be replaced when citizens apply
        age: 0, // Will be filled when citizens apply
        gender: 'N/A', // Will be filled when citizens apply
        income: 0, // Will be filled when citizens apply
        eligibilityMatch: true, // Default for new schemes
        status: 'Applied', // Default status for display
        appliedAt: new Date().toISOString(),
        isNew: true,
        // Extended scheme metadata
        schemeCode,
        category: formData.category,
        description: formData.description,
        objectives: formData.objectives,
        eligibilityCriteria: formData.eligibilityCriteria,
        targetBeneficiaries: formData.targetBeneficiaries,
        budgetAllocation: formData.budgetAllocation,
        maxIncomeLimit: formData.maxIncomeLimit,
        ageLimit: formData.ageLimit,
        launchDate: formData.launchDate,
        applicationDeadline: formData.applicationDeadline,
        implementingDepartment: formData.implementingDepartment,
        contactDetails: formData.contactDetails,
        requiredDocuments: formData.requiredDocuments,
        benefits: formData.benefits
      };

      onAddScheme(newScheme);
      
      toast({
        title: "New Scheme Created",
        description: `${formData.schemeName} has been successfully created and is now available for applications.`,
      });

      // Reset form
      setFormData({
        schemeName: '',
        schemeCode: '',
        category: '',
        description: '',
        objectives: '',
        eligibilityCriteria: '',
        targetBeneficiaries: '',
        budgetAllocation: '',
        maxIncomeLimit: '',
        ageLimit: '',
        launchDate: '',
        applicationDeadline: '',
        implementingDepartment: '',
        contactDetails: '',
        requiredDocuments: '',
        benefits: ''
      });

      onClose();
    } catch (error) {
      toast({
        title: "Creation Error",
        description: "Failed to create new scheme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-6 w-6 text-blue-600" />
            Create New Government Scheme
          </DialogTitle>
          <p className="text-muted-foreground">
            Add a new government scheme that citizens can apply for
          </p>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schemeName">Scheme Name *</Label>
                <Input
                  id="schemeName"
                  value={formData.schemeName}
                  onChange={(e) => handleInputChange('schemeName', e.target.value)}
                  placeholder="e.g., Digital Literacy for Rural Women"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schemeCode">Scheme Code</Label>
                <Input
                  id="schemeCode"
                  value={formData.schemeCode}
                  onChange={(e) => handleInputChange('schemeCode', e.target.value)}
                  placeholder="Auto-generated if left empty"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scheme category" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="implementingDepartment">Implementing Department</Label>
                <Input
                  id="implementingDepartment"
                  value={formData.implementingDepartment}
                  onChange={(e) => handleInputChange('implementingDepartment', e.target.value)}
                  placeholder="e.g., Ministry of Electronics & IT"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Scheme Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a comprehensive description of the scheme..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Scheme Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="List the main objectives and goals of this scheme..."
                rows={3}
              />
            </div>
          </div>

          {/* Eligibility & Target */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Eligibility & Target Beneficiaries
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetBeneficiaries">Target Beneficiaries *</Label>
                <Select value={formData.targetBeneficiaries} onValueChange={(value) => handleInputChange('targetBeneficiaries', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target group" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetBeneficiaries.map((target) => (
                      <SelectItem key={target} value={target}>
                        {target}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageLimit">Age Limit</Label>
                <Input
                  id="ageLimit"
                  value={formData.ageLimit}
                  onChange={(e) => handleInputChange('ageLimit', e.target.value)}
                  placeholder="e.g., 18-60 years, Above 65, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibilityCriteria">Detailed Eligibility Criteria</Label>
              <Textarea
                id="eligibilityCriteria"
                value={formData.eligibilityCriteria}
                onChange={(e) => handleInputChange('eligibilityCriteria', e.target.value)}
                placeholder="Specify detailed eligibility requirements, income limits, documentation needed, etc."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxIncomeLimit">Maximum Income Limit (₹ per annum)</Label>
              <Input
                id="maxIncomeLimit"
                type="number"
                value={formData.maxIncomeLimit}
                onChange={(e) => handleInputChange('maxIncomeLimit', e.target.value)}
                placeholder="e.g., 300000"
              />
            </div>
          </div>

          {/* Financial & Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              Financial & Timeline Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetAllocation">Budget Allocation (₹)</Label>
                <Input
                  id="budgetAllocation"
                  type="number"
                  value={formData.budgetAllocation}
                  onChange={(e) => handleInputChange('budgetAllocation', e.target.value)}
                  placeholder="Total budget in rupees"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="launchDate">Launch Date</Label>
                <Input
                  id="launchDate"
                  type="date"
                  value={formData.launchDate}
                  onChange={(e) => handleInputChange('launchDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Benefits & Documentation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Benefits & Documentation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="benefits">Scheme Benefits</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => handleInputChange('benefits', e.target.value)}
                placeholder="List all benefits, subsidies, or assistance provided under this scheme..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredDocuments">Required Documents</Label>
              <Textarea
                id="requiredDocuments"
                value={formData.requiredDocuments}
                onChange={(e) => handleInputChange('requiredDocuments', e.target.value)}
                placeholder="List all documents required for application (e.g., Aadhar Card, Income Certificate, etc.)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactDetails">Contact Information</Label>
              <Textarea
                id="contactDetails"
                value={formData.contactDetails}
                onChange={(e) => handleInputChange('contactDetails', e.target.value)}
                placeholder="Provide contact details for scheme inquiries and support..."
                rows={2}
              />
            </div>
          </div>

          {/* Preview Section */}
          {formData.schemeName && formData.category && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Scheme Preview
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Name:</strong> {formData.schemeName}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Target:</strong> {formData.targetBeneficiaries}</p>
                </div>
                <div>
                  <p><strong>Budget:</strong> {formData.budgetAllocation ? `₹${parseInt(formData.budgetAllocation).toLocaleString()}` : 'Not specified'}</p>
                  <p><strong>Income Limit:</strong> {formData.maxIncomeLimit ? `₹${parseInt(formData.maxIncomeLimit).toLocaleString()}` : 'Not specified'}</p>
                  <p><strong>Age Limit:</strong> {formData.ageLimit || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Scheme
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}